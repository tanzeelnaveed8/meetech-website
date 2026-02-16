import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/middleware'
import { getProjectById } from '@/lib/db/queries/projects'
import { prisma } from '@/lib/db/client'
import { uploadFile, validateFileSize, getFileCategory } from '@/lib/storage/blob'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR', 'VIEWER', 'CLIENT'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  const { session } = authCheck
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await params

  try {
    const project = await getProjectById(projectId, session.user.id, session.user.role)

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    return NextResponse.json({ files: project.files }, { status: 200 })
  } catch (error) {
    console.error('Get files error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  const { session } = authCheck
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await params

  try {
    // Verify project exists and user has access
    const project = await getProjectById(projectId, session.user.id, session.user.role)

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const description = formData.get('description') as string | null
    const category = formData.get('category') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    // Validate file size (50MB max)
    if (!validateFileSize(file.size, 50)) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const uploadResult = await uploadFile(file, `projects/${projectId}/${file.name}`)

    // Determine file category
    const fileCategory = category || getFileCategory(file.name)

    // Save file metadata to database
    const projectFile = await prisma.projectFile.create({
      data: {
        projectId,
        fileName: file.name,
        fileUrl: uploadResult.url,
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream',
        category: fileCategory,
        description: description || null,
        uploadedById: session.user.id,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ file: projectFile }, { status: 201 })
  } catch (error) {
    console.error('Upload file error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  const { searchParams } = new URL(request.url)
  const fileId = searchParams.get('fileId')

  if (!fileId) {
    return NextResponse.json(
      { error: 'File ID is required' },
      { status: 400 }
    )
  }

  try {
    // Get file to delete from blob storage
    const file = await prisma.projectFile.findUnique({
      where: { id: fileId },
    })

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Delete from blob storage
    const { deleteFile } = await import('@/lib/storage/blob')
    await deleteFile(file.fileUrl)

    // Delete from database
    await prisma.projectFile.delete({
      where: { id: fileId },
    })

    return NextResponse.json(
      { message: 'File deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete file error:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}
