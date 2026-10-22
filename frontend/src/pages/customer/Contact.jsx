import { Mail, Phone, MapPin, User, MessageSquare } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import { toast } from "react-toastify";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="text-white transition-colors">
      <div className="pt-12 pb-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Get in Touch
          </h1>
          <p className="mt-4 text-neutral-400 text-lg">
            Have a question, feedback, or need help?  
            We’d love to hear from you. Our team is always here to assist.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-14 items-start">
 
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <div className="flex gap-4 items-start group">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                <Mail className="text-indigo-400" size={20} />
              </div>
              <div className="pt-1">
                <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-1">Email Support</p>
                <p className="text-white text-lg font-medium">
                  support@annesiwhites.com
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start group">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                <Phone className="text-purple-400" size={20} />
              </div>
              <div className="pt-1">
                <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-1">Phone Enquiries</p>
                <p className="text-white text-lg font-medium">
                  +91 98765 43210
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start group">
              <div className="h-12 w-12 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 group-hover:bg-pink-500/20 transition-colors">
                <MapPin className="text-pink-400" size={20} />
              </div>
              <div className="pt-1">
                <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-1">Headquarters</p>
                <p className="text-white text-lg font-medium leading-relaxed">
                  221B Fashion Street, <br />
                  New Delhi, India
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <p className="text-sm text-neutral-500 max-w-sm">
                Our support team usually responds within 24 hours during standard business days.
              </p>
            </div>
          </motion.div>
 
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card withGlow glowColor="from-indigo-500/20 to-purple-500/20" className="p-8 border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Your Name"
                  type="text"
                  name="name"
                  icon={User}
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  icon={Mail}
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Message
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-neutral-400">
                      <MessageSquare size={18} />
                    </div>
                    <textarea
                      name="message"
                      rows="4"
                      required
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-white/50 transition-all duration-300 resize-none text-white placeholder:text-neutral-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="gradient"
                    fullWidth
                    isLoading={loading}
                  >
                    Send Message
                  </Button>
                </div>

                <p className="text-xs text-neutral-500 text-center font-medium">
                  We respect your privacy and don't share your details.
                </p>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;