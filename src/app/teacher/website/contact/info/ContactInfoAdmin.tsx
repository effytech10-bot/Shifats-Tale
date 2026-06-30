"use client";

import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";

export default function ContactInfoAdmin({ initialSectionData }: { initialSectionData: any }) {
  const content = initialSectionData?.content || {};
  
  const [phone, setPhone] = useState(content.phone || "+880 1879-169446");
  const [whatsapp, setWhatsapp] = useState(content.whatsapp || "8801879169446");
  const [officeHours, setOfficeHours] = useState(content.officeHours || "Daily 4:00 PM - 9:00 PM");
  const [facebookUrl, setFacebookUrl] = useState(content.facebookUrl || "https://facebook.com");
  const [youtubeUrl, setYoutubeUrl] = useState(content.youtubeUrl || "https://youtube.com");
  
  const [address, setAddress] = useState(content.address || "Sekandar & M.P Yusuf Building, 3rd Floor, next to Rangunia College, Rangunia, Chattogram, Bangladesh");
  const [transitInfo, setTransitInfo] = useState(content.transitInfo || "Conveniently located next to Rangunia College in Rangunia. Easily accessible from all parts of the area by local transport (CNG/bus).");
  const [securityInfo, setSecurityInfo] = useState(content.securityInfo || "24/7 CCTV surveillance, well-lit classrooms, and a highly secure academic environment for all students.");
  const [mapEmbedUrl, setMapEmbedUrl] = useState(content.mapEmbedUrl || "https://maps.google.com/maps?q=Rangunia%20Government%20College,%20Chattogram&t=&z=16&ie=UTF8&iwloc=&output=embed");
  const [mapDirectionUrl, setMapDirectionUrl] = useState(content.mapDirectionUrl || "https://maps.google.com/?q=Rangunia+Government+College+Chattogram");
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("CONTACT", "CONTACT_INFO", {
        status: "PUBLISHED",
        content: {
          phone,
          whatsapp,
          officeHours,
          facebookUrl,
          youtubeUrl,
          address,
          transitInfo,
          securityInfo,
          mapEmbedUrl,
          mapDirectionUrl
        }
      });
      toast.success("Contact info updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update contact info");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Location & Address Details</h2>
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
        <h3 className="font-bold text-gray-700 mt-2 mb-4 border-b pb-2">Direct Contact Channels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">WhatsApp Number (e.g. 88017...)</label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Office Hours</label>
            <input
              type="text"
              value={officeHours}
              onChange={(e) => setOfficeHours(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Facebook URL</label>
            <input
              type="text"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">YouTube URL</label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <h3 className="font-bold text-gray-700 mt-8 mb-4 border-b pb-2">Location Information</h3>
        <div>
          <label className="block text-sm font-semibold mb-1">Physical Venue Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent min-h-[80px]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">How to reach (Transit Info)</label>
          <textarea
            value={transitInfo}
            onChange={(e) => setTransitInfo(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent min-h-[80px]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Security & Facilities</label>
          <textarea
            value={securityInfo}
            onChange={(e) => setSecurityInfo(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent min-h-[80px]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Google Maps Embed URL</label>
          <input
            type="text"
            value={mapEmbedUrl}
            onChange={(e) => setMapEmbedUrl(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Google Maps Direction URL</label>
          <input
            type="text"
            value={mapDirectionUrl}
            onChange={(e) => setMapDirectionUrl(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
          />
        </div>
      </div>
    </div>
  );
}
