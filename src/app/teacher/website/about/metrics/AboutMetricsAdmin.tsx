"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { metricsData as defaultMetricsData, MetricItem } from "@/data/about";
import { IconPicker } from "@/features/website-cms/components/IconPicker";

export default function AboutMetricsAdmin({ initialSectionData }: { initialSectionData: any }) {
  const [metrics, setMetrics] = useState<MetricItem[]>(
    initialSectionData?.content?.metrics || defaultMetricsData
  );
  const [isSaving, setIsSaving] = useState(false);

  const addMetric = () => {
    const newMetric: MetricItem = {
      id: `metric-${Date.now()}`,
      iconName: "Target",
      value: "100+",
      label: "New Metric",
    };
    setMetrics([...metrics, newMetric]);
  };

  const updateMetric = (index: number, field: keyof MetricItem, value: string) => {
    const newMetrics = [...metrics];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    setMetrics(newMetrics);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("ABOUT", "ABOUT_METRICS", {
        status: "PUBLISHED",
        content: { metrics },
      });
      toast.success("Summary Metrics saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save Summary Metrics");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-border shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-primary">Summary Metrics Strip</h2>
          <p className="text-sm text-gray-500">Highlight your key achievements and numbers.</p>
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
          <h3 className="text-base font-bold text-[#08132E]">Metrics List</h3>
          <button onClick={addMetric} className="flex items-center space-x-1 text-sm text-primary font-semibold hover:text-accent">
            <Plus className="w-4 h-4" /> <span>Add Metric</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, idx) => (
            <div key={metric.id} className="border border-border p-4 rounded-xl flex flex-col sm:flex-row items-start gap-4 bg-gray-50/50">
              <div className="w-full sm:w-48 shrink-0">
                <label className="block text-xs font-semibold mb-1 text-gray-500">Icon</label>
                <IconPicker
                  value={metric.iconName}
                  onChange={(iconName) => updateMetric(idx, 'iconName', iconName)}
                />
              </div>
              <div className="flex-1 w-full grid grid-cols-1 gap-2">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Value (e.g. 50+)</label>
                  <input
                    type="text"
                    value={metric.value}
                    onChange={(e) => updateMetric(idx, 'value', e.target.value)}
                    className="w-full px-3 py-1.5 border border-border rounded-lg focus:border-accent text-sm font-bold text-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Label (e.g. Publications)</label>
                  <input
                    type="text"
                    value={metric.label}
                    onChange={(e) => updateMetric(idx, 'label', e.target.value)}
                    className="w-full px-3 py-1.5 border border-border rounded-lg focus:border-accent text-sm"
                  />
                </div>
              </div>
              <button 
                onClick={() => removeMetric(idx)} 
                className="text-red-400 hover:text-red-600 p-2 mt-4"
                title="Remove Metric"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {metrics.length === 0 && (
            <div className="col-span-full text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              No metrics added yet. Click "+ Add Metric" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
