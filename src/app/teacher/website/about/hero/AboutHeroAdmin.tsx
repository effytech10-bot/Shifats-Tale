"use client";

import React, { useState } from "react";
import { Check, Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { profileData as defaultProfileData, ProfileInfo, HeroStat, SocialLink } from "@/data/about";
import { MediaSelector } from "@/features/website-cms/components/MediaSelector";
import { IconPicker } from "@/features/website-cms/components/IconPicker";

const DEFAULT_PLATFORMS = ["Facebook", "Instagram", "Youtube", "Linkedin", "Twitter", "Github"];

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

  const addSocialLink = (platform: string) => {
    const newLink: SocialLink = {
      platform,
      url: "",
      iconName: platform as any,
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
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Icon</label>
                  <IconPicker
                    value={stat.iconName}
                    onChange={(iconName) => updateHeroStat(idx, 'iconName', iconName)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-bold text-[#08132E]">Social Links</h3>
          {(() => {
            const currentPlatforms = (profile.socialLinks || []).map(link => link.platform);
            const availablePlatforms = DEFAULT_PLATFORMS.filter(p => !currentPlatforms.includes(p));
            if (availablePlatforms.length === 0) return null;
            return (
              <select
                onChange={(e) => {
                  if (e.target.value) addSocialLink(e.target.value);
                  e.target.value = "";
                }}
                className="text-sm border border-border rounded-lg px-2 py-1 text-primary focus:border-accent"
                defaultValue=""
              >
                <option value="" disabled>+ Add Link</option>
                {availablePlatforms.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            );
          })()}
        </div>
        <div className="space-y-3">
          {(profile.socialLinks || []).map((link, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-border">
              <div className="w-full sm:w-32 shrink-0 flex items-center space-x-2 px-2 text-primary font-semibold">
                <span className="text-sm">{link.platform}</span>
              </div>
              <div className="w-full flex-1">
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                  placeholder={`${link.platform} Profile URL...`}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm text-blue-600"
                />
              </div>
              <button 
                onClick={() => removeSocialLink(idx)} 
                className="w-full sm:w-auto p-2 bg-white border border-red-200 rounded-md text-red-500 hover:bg-red-50 transition-colors flex justify-center items-center"
                title="Remove Link"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {(!profile.socialLinks || profile.socialLinks.length === 0) && (
            <div className="text-center py-4 text-sm text-gray-500">
              No social links added. Use the "+ Add Link" dropdown to add one.
            </div>
          )}
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
