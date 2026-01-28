import { auth } from '@/lib/auth/auth'

export default async function AdminContentPage() {
  const session = await auth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Content</h1>
        <p className="text-sm text-gray-600">
          Manage website content through Sanity Studio
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-6">
          <div className="space-y-6">
            {/* Sanity Studio Access */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Sanity Studio
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Access the Sanity Studio to create, edit, and publish content for all pages.
              </p>
              <div className="flex gap-3">
                <a
                  href={`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.sanity.studio`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  Open Sanity Studio
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Content Management Features */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Content Management Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Pages</h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Create and manage pages for UAE and USA regions
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>Home, Services, Solutions</li>
                    <li>Case Studies, Process, About</li>
                    <li>Contact, Privacy, Terms</li>
                    <li>Blog, Careers, Resources</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Content Blocks</h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Reusable content sections for pages
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>Hero sections</li>
                    <li>Features and testimonials</li>
                    <li>Call-to-action blocks</li>
                    <li>Text, images, and videos</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Media Assets</h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Upload and manage images with optimization
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>Automatic image optimization</li>
                    <li>Alt text for accessibility</li>
                    <li>Categorized organization</li>
                    <li>CDN delivery</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Multi-Region</h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Separate content for UAE and USA markets
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>Region-specific text</li>
                    <li>Localized images</li>
                    <li>Regional contact info</li>
                    <li>Independent publishing</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Workflow Instructions */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Content Publishing Workflow
              </h3>
              <ol className="text-xs text-gray-700 space-y-1.5">
                <li>1. Open Sanity Studio using the button above</li>
                <li>2. Create or edit a page/content block</li>
                <li>3. Save as draft to preview changes</li>
                <li>4. Click "Publish" when ready to go live</li>
                <li>5. Changes appear on the website within 2 minutes</li>
              </ol>
            </div>

            {/* User Info */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-xs text-gray-600">
                Logged in as: <span className="font-medium">{session?.user?.email}</span>
                {session?.user?.role && <> ({session.user.role})</>}
              </p>
            </div>
          </div>
        </div>
    </div>
  )
}
