"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FileUpload } from "@/components/ui/FileUpload";
import { EASE, DURATION } from "@/lib/constants";
import { User, Mail, Phone, Building2, DollarSign, Calendar, MessageSquare, Briefcase } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  file: File | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  file?: string;
}

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const PROJECT_TYPES = [
  "Website Development",
  "Mobile App (iOS/Android)",
  "E-commerce Platform",
  "Custom Software",
  "MVP Development",
  "UI/UX Design",
  "Consulting",
  "Other",
];

const BUDGET_RANGES = [
  "Under $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000+",
  "Not sure yet",
];

const TIMELINE_OPTIONS = [
  "ASAP (1-2 weeks)",
  "1-2 months",
  "3-6 months",
  "6+ months",
  "Flexible",
];

export function ContactForm() {
  const reduce = Boolean(useReducedMotion());

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
    file: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phone.length >= 10 && phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.projectType) {
      newErrors.projectType = "Please select a project type";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 20) {
      newErrors.message = "Please provide more details (minimum 20 characters)";
    } else if (formData.message.length > 2000) {
      newErrors.message = "Message must be less than 2000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitStatus("submitting");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("company", formData.company);
      formDataToSend.append("projectType", formData.projectType);
      formDataToSend.append("budget", formData.budget);
      formDataToSend.append("timeline", formData.timeline);
      formDataToSend.append("message", formData.message);
      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }
      formDataToSend.append("source", "contact-page");

      // Mock API call for development
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectType: "",
        budget: "",
        timeline: "",
        message: "",
        file: null,
      });
      setErrors({});
    } catch (error) {
      setSubmitStatus("error");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, file }));
  };

  if (submitStatus === "success") {
    return (
      <motion.section
        initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="border-t border-border-default py-16 md:py-20"
      >
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6 flex justify-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-text-primary md:text-4xl"
          >
            Message Sent Successfully!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-lg text-text-body"
          >
            Thank you for reaching out! We've received your inquiry and our team will get back to you within 24 hours.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => setSubmitStatus("idle")}
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-accent px-6 py-3 text-base font-semibold text-text-inverse shadow-sm transition-all duration-200 hover:bg-accent-hover hover:shadow-md"
            >
              Send Another Message
            </button>
            <a
              href="/"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-accent bg-transparent px-6 py-3 text-base font-semibold text-accent transition-colors hover:bg-accent-muted"
            >
              Back to Home
            </a>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION, ease: EASE }}
      className="border-t border-border-default py-16 md:py-20"
      aria-labelledby="contact-form-heading"
    >
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 id="contact-form-heading" className="text-3xl font-bold text-text-primary md:text-4xl mb-4">
            Tell Us About Your Project
          </h2>
          <p className="text-lg text-text-body">
            Fill out the form below and we'll get back to you within 24 hours
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Personal Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="name" className="block text-sm font-semibold text-text-primary mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 px-2 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-text-muted mr-2" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`block w-full pl-8 pr-4 py-3.5 rounded-xl border ${errors.name ? "border-red-500 focus:ring-red-500" : "border-border-default focus:ring-accent"
                    } bg-bg-surface text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:ring-2 focus:border-transparent shadow-sm hover:shadow-md`}
                  placeholder="John Smith"
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.name}
                </p>
              )}
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 px-2 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-muted mr-2" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`block w-full pl-8 pr-4 py-3.5 rounded-xl border ${errors.email ? "border-red-500 focus:ring-red-500" : "border-border-default focus:ring-accent"
                    } bg-bg-surface text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:ring-2 focus:border-transparent shadow-sm hover:shadow-md`}
                  placeholder="john@company.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.email}
                </p>
              )}
            </motion.div>

            {/* Phone Field */}
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="phone" className="block text-sm font-semibold text-text-primary mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 px-2 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-text-muted mr-2" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`block w-full pl-8 pr-4 py-3.5 rounded-xl border ${errors.phone ? "border-red-500 focus:ring-red-500" : "border-border-default focus:ring-accent"
                    } bg-bg-surface text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:ring-2 focus:border-transparent shadow-sm hover:shadow-md`}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              {errors.phone && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.phone}
                </p>
              )}
            </motion.div>

            {/* Company Field */}
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label htmlFor="company" className="block text-sm font-semibold text-text-primary mb-2">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 px-2 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-text-muted mr-2" />
                </div>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="block w-full pl-8 pr-4 py-3.5 rounded-xl border border-border-default bg-bg-surface text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent shadow-sm hover:shadow-md"
                  placeholder="Your Company"
                />
              </div>
            </motion.div>
          </div>

          {/* Project Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project Type */}
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label
                htmlFor="projectType"
                className="block text-sm font-semibold text-text-primary mb-2"
              >
                Project Type <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 px-2 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-text-muted mr-2" />
                </div>

                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-8 pr-10 py-3.5 rounded-xl border ${errors.projectType
                      ? "border-red-500 focus:ring-red-500"
                      : "border-border-default focus:ring-accent"
                    } bg-bg-surface text-sm text-text-primary transition-all focus:outline-none focus:ring-2 focus:border-transparent shadow-sm hover:shadow-md appearance-none cursor-pointer`}
                >
                  <option className=" text-sm w-fit" value="">Select type</option>
                  {PROJECT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {errors.projectType && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.projectType}
                </p>
              )}
            </motion.div>

            {/* Budget */}
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label
                htmlFor="budget"
                className="block text-sm font-semibold text-text-primary mb-2"
              >
                Budget Range
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 px-2 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-text-muted mr-2" />
                </div>

                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full  text-sm pl-12 pr-10 py-3.5 rounded-xl border border-border-default bg-bg-surface text-text-primary transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent shadow-sm hover:shadow-md appearance-none cursor-pointer"
                >
                  <option className=" text-sm w-fit" value="">Select budget</option>
                  {BUDGET_RANGES.map((range) => (
                    <option className="text-sm w-fit" key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label
                htmlFor="timeline"
                className="block text-sm font-semibold text-text-primary mb-2"
              >
                Timeline
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 px-2 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-text-muted mr-2" />
                </div>

                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full  pl-12 pr-10 py-3.5 rounded-xl border border-border-default bg-bg-surface text-text-primary transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent shadow-sm hover:shadow-md appearance-none cursor-pointer"
                >
                  <option 

                  value="">Select timeline</option>
                  {TIMELINE_OPTIONS.map((option) => (
                    <option className="text-sm w-fit" key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          </div>


          {/* Message Field */}
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <label htmlFor="message" className="block text-sm font-semibold text-text-primary mb-2">
              Project Details <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-4 px-2 pointer-events-none">
                <MessageSquare className="h-5 w-5 text-text-muted mr-2" />
              </div>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                maxLength={2000}
                className={`block w-full pl-10 pr-4 py-3.5 rounded-xl border ${errors.message ? "border-red-500 focus:ring-red-500" : "border-border-default focus:ring-accent"
                  } bg-bg-surface text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:ring-2 focus:border-transparent shadow-sm hover:shadow-md resize-none`}
                placeholder=" Tell us about your project goals, requirements, and any specific features you need..."
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              {errors.message ? (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.message}
                </p>
              ) : (
                <span className="text-sm text-text-muted">
                  {formData.message.length}/2000 characters
                </span>
              )}
            </div>
          </motion.div>

          {/* File Upload */}
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <FileUpload onFileChange={handleFileChange} error={errors.file} />
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <button
              type="submit"
              disabled={submitStatus === "submitting"}
              className="w-full inline-flex min-h-[56px] items-center justify-center rounded-xl bg-gradient-to-r from-accent to-accent-hover px-8 py-4 text-lg font-bold text-text-inverse shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              {submitStatus === "submitting" ? (
                <>
                  <svg
                    className="mr-3 h-6 w-6 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending Your Message...
                </>
              ) : (
                <>
                  Send Message
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </motion.div>

          {submitStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-900/20 p-6"
              role="alert"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
                    Submission Failed
                  </h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                    An error occurred while sending your message. Please try again or contact us directly at contact@meetech.com
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </motion.section>
  );
}
