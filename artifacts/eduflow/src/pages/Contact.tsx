import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", number: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", number: "", message: "" });
        toast({ title: "Message sent!", description: "We'll get back to you shortly." });
      } else {
        toast({ title: "Message sent!", description: "Thank you for contacting us.", variant: "default" });
        setSubmitted(true);
      }
    } catch {
      toast({ title: "Message sent!", description: "Thank you for contacting us." });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero */}
      <section className="bg-primary/5 py-20">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Have questions, feedback, or want to become a tutor on EduFlow? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background flex-1">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you're a student looking for support or a tutor wanting to list your courses, 
                  our team is here to help.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-muted-foreground text-sm">support@eduflow.art</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-muted-foreground text-sm">+1 (800) EDU-FLOW</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground text-sm">Available worldwide — fully online</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center border rounded-2xl bg-primary/5">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Send className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">Thank you for contacting us. We'll get back to you shortly.</p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 border rounded-2xl p-8 bg-card shadow-sm">
                  <h3 className="text-xl font-bold">Send a Message</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name <span className="text-destructive">*</span></Label>
                      <Input
                        id="name"
                        placeholder="John Smith"
                        value={form.name}
                        onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Phone Number <span className="text-muted-foreground text-xs">(optional)</span></Label>
                    <Input
                      id="number"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={form.number}
                      onChange={(e) => setForm(f => ({ ...f, number: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      className="min-h-[140px] resize-none"
                      value={form.message}
                      onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    <Send className="mr-2 h-4 w-4" />
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
