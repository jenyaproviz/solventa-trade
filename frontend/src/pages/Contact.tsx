import { useEffect, useRef, useState, type FormEvent } from "react"
import { Mail, Phone, MapPin, Paperclip, Send, X } from "lucide-react"
import PageSectionLayout from "../components/layout/PageSectionLayout"
import Button from "../components/ui/Button"
import { sendContactMessage, type ContactMessageResponse } from "../services/contactService"

const RECIPIENT = "solventatrade@gmail.com"
const COOLDOWN_SECONDS = 45
const CONTACT_LAST_SENT_KEY = "solventa_contact_last_sent_at"

export default function Contact() {
  const [name, setName]       = useState("")
  const [email, setEmail]     = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [website, setWebsite] = useState("")
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
  const [attachmentB64, setAttachmentB64] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [submitResult, setSubmitResult] = useState<ContactMessageResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  useEffect(() => {
    const rawLastSent = localStorage.getItem(CONTACT_LAST_SENT_KEY)
    if (!rawLastSent) return

    const lastSentMs = Number(rawLastSent)
    if (!Number.isFinite(lastSentMs)) return

    const elapsedSeconds = Math.floor((Date.now() - lastSentMs) / 1000)
    const remaining = Math.max(0, COOLDOWN_SECONDS - elapsedSeconds)
    setRemainingSeconds(remaining)
  }, [])

  useEffect(() => {
    if (remainingSeconds <= 0) return

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [remainingSeconds])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (!file) {
      setAttachmentFile(null)
      setAttachmentB64("")
      return
    }
    const MAX_MB = 5
    if (file.size > MAX_MB * 1024 * 1024) {
      setSubmitError(`Attachment must be smaller than ${MAX_MB} MB.`)
      e.target.value = ""
      return
    }
    setAttachmentFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(",")[1] ?? ""
      setAttachmentB64(base64)
    }
    reader.readAsDataURL(file)
  }

  function removeAttachment() {
    setAttachmentFile(null)
    setAttachmentB64("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (remainingSeconds > 0) {
      setSubmitError(`Please wait ${remainingSeconds}s before sending another message.`)
      return
    }

    // Honeypot field: if filled, treat as bot and silently stop.
    if (website.trim() !== "") {
      setSubmitResult({
        ok: true,
        saved: false,
        delivered: false,
        message: "Contact message ignored.",
      })
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const result = await sendContactMessage({
        name,
        email,
        subject,
        message,
        file: attachmentFile,
        attachment: attachmentB64,
        attachmentName: attachmentFile?.name,
        attachmentType: attachmentFile?.type,
      })
      setSubmitResult(result)
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
      setWebsite("")
      setAttachmentFile(null)
      setAttachmentB64("")
      if (fileInputRef.current) fileInputRef.current.value = ""
      localStorage.setItem(CONTACT_LAST_SENT_KEY, Date.now().toString())
      setRemainingSeconds(COOLDOWN_SECONDS)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send message. Please try again."
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputBase =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none " +
    "placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"

  return (
    <PageSectionLayout title="Contact Us" theme="ocean">
      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-14">
        {/* Left: contact info */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-300 bg-transparent px-6 py-7 shadow-sm">
            <h2 className="text-xl font-bold text-[#0c3b67]">Get in touch</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-700">
              Have a question or a business inquiry? Fill in the form and we will get back to you promptly.
            </p>
            <ul className="mt-7 space-y-5">
              <li className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <Mail className="h-5 w-5 text-orange-500" strokeWidth={1.8} />
                </div>
                <a href={`mailto:${RECIPIENT}`} className="text-base text-[#0c3b67] underline-offset-2 hover:underline">
                  {RECIPIENT}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <Phone className="h-5 w-5 text-orange-500" strokeWidth={1.8} />
                </div>
                <span className="text-base text-slate-700">+359 000 000 000</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <MapPin className="h-5 w-5 text-orange-500" strokeWidth={1.8} />
                </div>
                <span className="text-base text-slate-700">Sofia, Bulgaria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: form */}
        <div className="rounded-2xl border border-slate-300 bg-transparent px-6 py-7 shadow-sm">
          {submitResult ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <Send className="h-7 w-7 text-orange-500" strokeWidth={1.8} />
              </div>
              <h2 className="text-2xl font-bold text-[#0c3b67]">
                {submitResult.delivered ? "Message sent successfully!" : "Message saved successfully!"}
              </h2>
              <p className="text-base text-slate-600">
                {submitResult.message}
              </p>
              <Button
                onClick={() => setSubmitResult(null)}
                className="mt-2 px-6 py-2.5"
              >
                Send another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Your Name</label>
                  <input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Smith"
                    className={inputBase}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Your Email</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputBase}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Subject</label>
                <input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Business inquiry"
                  className={inputBase}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Message</label>
                <textarea
                  required
                  rows={6}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className={`${inputBase} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Attach file <span className="font-normal text-slate-500">(optional, max 5 MB)</span></label>
                {attachmentFile ? (
                  <div className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5">
                    <Paperclip className="h-4 w-4 shrink-0 text-orange-500" />
                    <span className="flex-1 truncate text-sm text-slate-700">{attachmentFile.name}</span>
                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="rounded-full p-0.5 text-slate-500 hover:text-red-500"
                      aria-label="Remove attachment"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 transition hover:border-orange-400 hover:text-orange-600">
                    <Paperclip className="h-4 w-4" />
                    Click to attach a file
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
              {submitError ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {submitError}
                </p>
              ) : null}
              <Button
                type="submit"
                disabled={isSubmitting || remainingSeconds > 0}
                className="gap-2 px-8 text-base shadow-sm active:scale-[0.98]"
              >
                <Send className="h-4 w-4" strokeWidth={2} />
                {isSubmitting
                  ? "Sending..."
                  : remainingSeconds > 0
                    ? `Wait ${remainingSeconds}s`
                    : "Send Message"}
              </Button>
              {remainingSeconds > 0 ? (
                <p className="text-sm text-slate-600">
                  Anti-spam protection is active. You can send the next message in {remainingSeconds}s.
                </p>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </PageSectionLayout>
  )
}
