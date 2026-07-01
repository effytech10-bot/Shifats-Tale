"use client";

import React, { useState } from "react";
import { Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { projectsData as defaultData, ProjectItem } from "@/data/about";
import { IconPicker } from "@/features/website-cms/components/IconPicker";
import { MediaSelector } from "@/features/website-cms/components/MediaSelector";

export default function AboutProjectsAdmin({ initialSectionData }: { initialSectionData: any }) {
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(
    initialSectionData?.content?.projects || defaultData
  );
  const [isSaving, setIsSaving] = useState(false);
  const [editingProjectImageIndex, setEditingProjectImageIndex] = useState<number | null>(null);

  const addProject = () => {
    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: "New Project",
      shortDescription: "",
      category: "Energy",
      iconName: "Sun",
      imageUrl: "",
      isFeatured: false,
      technologies: [],
      metrics: [],
      actionLinks: [],
      displayOrder: projectsList.length,
    };
    setProjectsList([newProject, ...projectsList]);
  };

  const updateProject = (index: number, field: keyof ProjectItem, value: any) => {
    const newList = [...projectsList];
    newList[index] = { ...newList[index], [field]: value };
    setProjectsList(newList);
  };

  const removeProject = (index: number) => {
    setProjectsList(projectsList.filter((_, i) => i !== index));
  };

  const addMetric = (projectIndex: number) => {
    const project = projectsList[projectIndex];
    const newMetric = { label: "Label", value: "Value", iconName: "CheckCircle" };
    updateProject(projectIndex, "metrics", [...(project.metrics || []), newMetric]);
  };

  const updateMetric = (projectIndex: number, metricIndex: number, field: string, value: string) => {
    const project = projectsList[projectIndex];
    const newMetrics = [...(project.metrics || [])];
    newMetrics[metricIndex] = { ...newMetrics[metricIndex], [field]: value };
    updateProject(projectIndex, "metrics", newMetrics);
  };

  const removeMetric = (projectIndex: number, metricIndex: number) => {
    const project = projectsList[projectIndex];
    const newMetrics = (project.metrics || []).filter((_, i) => i !== metricIndex);
    updateProject(projectIndex, "metrics", newMetrics);
  };

  const addActionLink = (projectIndex: number) => {
    const project = projectsList[projectIndex];
    const newLink = { label: "View Details", url: "#", iconName: "ArrowRight", variant: "outline" };
    updateProject(projectIndex, "actionLinks", [...(project.actionLinks || []), newLink as any]);
  };

  const updateActionLink = (projectIndex: number, linkIndex: number, field: string, value: string) => {
    const project = projectsList[projectIndex];
    const newLinks = [...(project.actionLinks || [])];
    newLinks[linkIndex] = { ...newLinks[linkIndex], [field]: value };
    updateProject(projectIndex, "actionLinks", newLinks);
  };

  const removeActionLink = (projectIndex: number, linkIndex: number) => {
    const project = projectsList[projectIndex];
    const newLinks = (project.actionLinks || []).filter((_, i) => i !== linkIndex);
    updateProject(projectIndex, "actionLinks", newLinks);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("ABOUT", "ABOUT_PROJECTS", {
        status: "PUBLISHED",
        content: { projects: projectsList },
      });
      toast.success("Projects Grid saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save projects");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-border shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-primary">Projects Grid</h2>
          <p className="text-sm text-gray-500">Manage your project portfolio and featured projects.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-accent text-primary font-bold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-base font-bold text-[#08132E]">Projects List</h3>
          <button onClick={addProject} className="flex items-center space-x-1 text-sm text-primary font-semibold hover:text-accent">
            <Plus className="w-4 h-4" /> <span>Add Project</span>
          </button>
        </div>

        <div className="space-y-8">
          {projectsList.map((item, idx) => (
            <div key={item.id} className="border border-border p-6 rounded-xl flex flex-col sm:flex-row items-start gap-4 bg-gray-50/50">
              <div className="cursor-grab active:cursor-grabbing text-gray-400 mt-2 shrink-0 hidden sm:block">
                <GripVertical className="w-5 h-5" />
              </div>
              
              <div className="flex-1 w-full space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 flex justify-between">
                     <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={item.isFeatured || false}
                          onChange={(e) => updateProject(idx, 'isFeatured', e.target.checked)}
                          className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                        />
                        <span className="text-sm font-bold text-primary">Make Featured Project</span>
                     </label>
                     <button 
                        onClick={() => removeProject(idx)} 
                        className="text-red-400 hover:text-red-600 p-1 flex items-center space-x-1 text-xs font-bold"
                      >
                        <Trash2 className="w-4 h-4" /> <span>Delete Project</span>
                      </button>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Project Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateProject(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm font-bold text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Category</label>
                    <select
                      value={item.category}
                      onChange={(e) => updateProject(idx, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm bg-white"
                    >
                      <option value="Energy">Energy</option>
                      <option value="Power">Power</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Embedded">Embedded</option>
                      <option value="CAD">CAD</option>
                      <option value="Automation">Automation</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Category Icon</label>
                    <IconPicker
                      value={item.iconName}
                      onChange={(iconName) => updateProject(idx, 'iconName', iconName)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-2 text-gray-500">Project Cover Image</label>
                    <div className="flex items-center gap-4">
                      {item.imageUrl ? (
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-border shrink-0">
                          <img src={item.imageUrl} alt="Project cover" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-lg border border-dashed border-gray-300 flex items-center justify-center bg-gray-50 shrink-0">
                          <ImageIcon className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <button
                          type="button"
                          onClick={() => setEditingProjectImageIndex(idx)}
                          className="px-4 py-1.5 text-xs font-semibold text-primary hover:text-accent border border-primary/20 bg-white rounded-md transition-colors"
                        >
                          {item.imageUrl ? "Change Image" : "Select Image"}
                        </button>
                        <p className="text-[10px] text-gray-400">
                          Recommended ratio is 16:9 (e.g. 800x450px). Use the Media Selector to upload or choose an existing image.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Short Description</label>
                    <textarea
                      value={item.shortDescription}
                      onChange={(e) => updateProject(idx, 'shortDescription', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Technologies (comma separated)</label>
                    <input
                      type="text"
                      value={(item.technologies || []).join(", ")}
                      onChange={(e) => updateProject(idx, 'technologies', e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                      placeholder="React, Next.js, Tailwind..."
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="bg-white p-4 rounded-xl border border-[#E7E0D2] shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-primary">Project Metrics</h4>
                    <button onClick={() => addMetric(idx)} className="text-xs font-bold text-accent hover:underline">
                      + Add Metric
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(item.metrics || []).map((metric, mIdx) => (
                      <div key={mIdx} className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                          type="text"
                          value={metric.label}
                          onChange={(e) => updateMetric(idx, mIdx, "label", e.target.value)}
                          placeholder="Label (e.g. ROI)"
                          className="w-full sm:w-1/3 px-2 py-1.5 border border-border rounded-md text-xs"
                        />
                        <input
                          type="text"
                          value={metric.value}
                          onChange={(e) => updateMetric(idx, mIdx, "value", e.target.value)}
                          placeholder="Value (e.g. 50%)"
                          className="w-full sm:w-1/3 px-2 py-1.5 border border-border rounded-md text-xs font-bold"
                        />
                        <div className="w-full sm:w-1/4">
                          <IconPicker
                            value={metric.iconName}
                            onChange={(iconName) => updateMetric(idx, mIdx, "iconName", iconName)}
                            className="text-xs"
                          />
                        </div>
                        <button onClick={() => removeMetric(idx, mIdx)} className="text-red-400 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(!item.metrics || item.metrics.length === 0) && (
                      <p className="text-xs text-gray-400">No metrics added.</p>
                    )}
                  </div>
                </div>

                {/* Action Links */}
                <div className="bg-white p-4 rounded-xl border border-[#E7E0D2] shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-primary">Action Links</h4>
                    <button onClick={() => addActionLink(idx)} className="text-xs font-bold text-accent hover:underline">
                      + Add Link
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(item.actionLinks || []).map((link, lIdx) => (
                      <div key={lIdx} className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => updateActionLink(idx, lIdx, "label", e.target.value)}
                          placeholder="Label"
                          className="w-full sm:w-1/4 px-2 py-1.5 border border-border rounded-md text-xs font-bold"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => updateActionLink(idx, lIdx, "url", e.target.value)}
                          placeholder="URL"
                          className="w-full sm:w-1/3 px-2 py-1.5 border border-border rounded-md text-xs"
                        />
                        <div className="w-full sm:w-1/4">
                          <IconPicker
                            value={link.iconName}
                            onChange={(iconName) => updateActionLink(idx, lIdx, "iconName", iconName)}
                            className="text-xs"
                          />
                        </div>
                        <select
                          value={link.variant || "outline"}
                          onChange={(e) => updateActionLink(idx, lIdx, "variant", e.target.value)}
                          className="w-full sm:w-1/4 px-2 py-1.5 border border-border rounded-md text-xs"
                        >
                          <option value="outline">Outline</option>
                          <option value="primary">Primary</option>
                        </select>
                        <button onClick={() => removeActionLink(idx, lIdx)} className="text-red-400 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(!item.actionLinks || item.actionLinks.length === 0) && (
                      <p className="text-xs text-gray-400">No action links added.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
          {projectsList.length === 0 && (
            <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              No projects added yet. Click "+ Add Project" to create one.
            </div>
          )}
        </div>
      </div>

      {editingProjectImageIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-primary">Select Image</h3>
              <button 
                onClick={() => setEditingProjectImageIndex(null)}
                className="text-gray-500 hover:text-red-500"
              >
                Close
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <MediaSelector
                folderKey="about"
                onSelect={(url) => {
                  updateProject(editingProjectImageIndex, 'imageUrl', url);
                  setEditingProjectImageIndex(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
