"use client";

import React, { useState } from "react";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function ContactFAQAdmin({ initialSectionData }: { initialSectionData: any }) {
  const defaultFaqs: FAQItem[] = [
    { id: generateId(), question: "Where is the coaching center located?", answer: "Our offline facility is located at Sekandar & M.P Yusuf Building (3rd Floor), next to Rangunia College." },
    { id: generateId(), question: "How can I join the coaching?", answer: "To enroll, please contact Shifat Sir directly on WhatsApp or over the phone." }
  ];

  const initialFaqs = initialSectionData?.content?.faqs || defaultFaqs;
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddFaq = () => {
    setFaqs([...faqs, { id: generateId(), question: "", answer: "" }]);
  };

  const handleRemoveFaq = (id: string) => {
    setFaqs(faqs.filter(f => f.id !== id));
  };

  const handleFaqChange = (id: string, field: keyof FAQItem, value: string) => {
    setFaqs(faqs.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("CONTACT", "CONTACT_FAQ", {
        status: "PUBLISHED",
        content: { faqs }
      });
      toast.success("Contact FAQ updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update contact FAQ");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Frequently Asked Questions</h2>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="primary-btn flex items-center space-x-2 text-sm px-6 py-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="p-4 border border-border rounded-xl bg-gray-50 relative group">
            <button 
              onClick={() => handleRemoveFaq(faq.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="space-y-3 pr-10">
              <div>
                <label className="block text-sm font-semibold mb-1">Question {index + 1}</label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(faq.id, "question", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
                  placeholder="e.g. What is the fee structure?"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Answer</label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(faq.id, "answer", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent min-h-[80px]"
                  placeholder="e.g. Please contact us to learn about..."
                />
              </div>
            </div>
          </div>
        ))}
        
        <button 
          onClick={handleAddFaq}
          className="w-full py-3 border-2 border-dashed border-border rounded-xl text-gray-500 hover:border-accent hover:text-accent transition-colors flex items-center justify-center space-x-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add New FAQ</span>
        </button>
      </div>
    </div>
  );
}
