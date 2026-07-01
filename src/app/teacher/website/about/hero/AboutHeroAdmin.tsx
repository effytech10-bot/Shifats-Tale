"use client";

import React, { useState } from "react";
import { Check, Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { profileData as defaultProfileData, ProfileInfo, HeroStat, SocialLink } from "@/data/about";
import { MediaSelector } from "@/features/website-cms/components/MediaSelector";

export default function AboutHeroAdmin({ initialSectionData }: { initialSectionData: any }) {
  const [profile, setProfile] = useState<ProfileInfo>(initialSectionData?.content || defaultProfileData);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const updateProfile = (field: keyof ProfileInfo, value: any) => {
    setProfile({ ...profile, [field]: value });
  };

  const addHeroStat = () => {
    const newStat: HeroStat = {
      iconName: "GraduationCap",
      label: "New Stat",
      value: "10+",
      subValue: "Subtitle",
    };
    setProfile({ ...profile, heroStats: [...(profile.heroStats || []), newStat] });
  };

  const updateHeroStat = (index: number, field: keyof HeroStat, value: string) => {
    const stats = [...(profile.heroStats || [])];
    stats[index] = { ...stats[index], [field]: value };
    setProfile({ ...profile, heroStats: stats });
  };

  const removeHeroStat = (index: number) => {
    const stats = (profile.heroStats || []).filter((_, i) => i !== index);
    setProfile({ ...profile, heroStats: stats });
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      platform: "New Platform",
      url: "#",
      iconName: "Facebook",
    };
    setProfile({ ...profile, socialLinks: [...(profile.socialLinks || []), newLink] });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const links = [...(profile.socialLinks || [])];
    links[index] = { ...links[index], [field]: value };
    setProfile({ ...profile, socialLinks: links });
  };

  const removeSocialLink = (index: number) => {
    const links = (profile.socialLinks || []).filter((_, i) => i !== index);
    setProfile({ ...profile, socialLinks: links });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("ABOUT", "ABOUT_HERO", {
        status: "PUBLISHED",
        content: profile
      });
      toast.success("About Hero section saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save About Hero section");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-end">
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="primary-btn flex items-center space-x-2 text-sm px-6 py-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-6">
        <h3 className="text-lg font-bold text-[#08132E] border-b pb-2">Profile Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 flex flex-col items-center space-y-4">
            <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center relative">
              {profile.imageUrl ? (
                <Image src={profile.imageUrl} alt="Profile" fill className="object-cover" />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-300" />
              )}
            </div>
            <button
              onClick={() => setIsMediaModalOpen(true)}
              className="text-sm font-semibold text-primary hover:text-accent border border-primary/20 bg-white rounded-full px-4 py-2"
            >
              Change Profile Photo
            </button>
          </div>

          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile('name', e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Greeting</label>
              <input
                type="text"
                value={profile.greeting || ""}
                onChange={(e) => updateProfile('greeting', e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Subtitle</label>
              <input
                type="text"
                value={profile.subtitle || ""}
                onChange={(e) => updateProfile('subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Summary</label>
              <textarea
                value={profile.summary}
                onChange={(e) => updateProfile('summary', e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
                rows={3}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Quote (Optional)</label>
              <input
                type="text"
                value={profile.quote || ""}
                onChange={(e) => updateProfile('quote', e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent italic"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-bold text-[#08132E]">Hero Stats</h3>
          <button onClick={addHeroStat} className="flex items-center space-x-1 text-sm text-primary font-semibold hover:text-accent">
            <Plus className="w-4 h-4" /> <span>Add Stat</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(profile.heroStats || []).map((stat, idx) => (
            <div key={idx} className="border border-border p-4 rounded-xl relative">
              <button 
                onClick={() => removeHeroStat(idx)} 
                className="absolute top-2 right-2 text-red-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Value (e.g. 5+ Years)</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateHeroStat(idx, 'value', e.target.value)}
                    className="w-full px-3 py-1.5 border border-border rounded-lg focus:border-accent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Label (e.g. Educator)</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateHeroStat(idx, 'label', e.target.value)}
                    className="w-full px-3 py-1.5 border border-border rounded-lg focus:border-accent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Sub Value</label>
                  <input
                    type="text"
                    value={stat.subValue}
                    onChange={(e) => updateHeroStat(idx, 'subValue', e.target.value)}
                    className="w-full px-3 py-1.5 border border-border rounded-lg focus:border-accent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Icon Name</label>
                  <select
                    value={stat.iconName}
                    onChange={(e) => updateHeroStat(idx, 'iconName', e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-border rounded-lg focus:border-accent text-sm"
                  >
                    <option value="GraduationCap">Graduation Cap</option>
                    <option value="Users">Users</option>
                    <option value="Youtube">Youtube</option>
                    <option value="MapPin">Map Pin</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-bold text-[#08132E]">Social Links</h3>
          <button onClick={addSocialLink} className="flex items-center space-x-1 text-sm text-primary font-semibold hover:text-accent">
            <Plus className="w-4 h-4" /> <span>Add Link</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(profile.socialLinks || []).map((link, idx) => (
            <div key={idx} className="border border-border p-4 rounded-xl flex items-center space-x-3">
              <div className="flex-1 grid grid-cols-1 gap-2">
                <input
                  type="text"
                  value={link.platform}
                  onChange={(e) => updateSocialLink(idx, 'platform', e.target.value)}
                  placeholder="Platform Name"
                  className="w-full px-3 py-1.5 border border-border rounded-lg focus:border-accent text-sm"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                  placeholder="URL"
                  className="w-full px-3 py-1.5 border border-border rounded-lg focus:border-accent text-sm text-blue-600"
                />
                <select
                  value={link.iconName}
                  onChange={(e) => updateSocialLink(idx, 'iconName', e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-border rounded-lg focus:border-accent text-sm"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Youtube">Youtube</option>
                  <option value="Linkedin">LinkedIn</option>
                  <option value="Twitter">Twitter</option>
                </select>
              </div>
              <button 
                onClick={() => removeSocialLink(idx)} 
                className="text-red-400 hover:text-red-600 p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {isMediaModalOpen && (
        <MediaSelector
          folderKey="about"
          onSelect={(url) => {
            updateProfile('imageUrl', url);
            setIsMediaModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
