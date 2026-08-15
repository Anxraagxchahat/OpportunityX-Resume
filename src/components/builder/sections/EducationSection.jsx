import React from 'react';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

export const EducationSection = ({
  education = [],
  updateEducation,
  addEducationItem,
  removeEducationItem
}) => {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-orange-400" /> Education ({education.length})
        </h2>
        <button onClick={addEducationItem} className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Education
        </button>
      </div>

      <div className="space-y-4">
        {education.map((edu, idx) => {
          const itemKey = edu.id || `edu-${idx}`;
          return (
            <div key={itemKey} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-orange-400">{edu.degree || `Education #${idx + 1}`}</span>
                <button onClick={() => removeEducationItem(edu.id)} className="p-1 text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Degree / Major</label>
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => updateEducation(education.map((ed, i) => (i === idx || (ed.id && ed.id === edu.id) ? { ...ed, degree: e.target.value } : ed)))}
                    placeholder="e.g. Bachelor of Computer Applications"
                    className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">University / School</label>
                  <input
                    type="text"
                    value={edu.institution || edu.college || ''}
                    onChange={(e) => updateEducation(education.map((ed, i) => (i === idx || (ed.id && ed.id === edu.id) ? { ...ed, institution: e.target.value, college: e.target.value } : ed)))}
                    placeholder="e.g. Babu Banarasi Das University"
                    className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Start Date</label>
                  <input
                    type="text"
                    value={edu.startDate || ''}
                    onChange={(e) => updateEducation(education.map((ed, i) => (i === idx || (ed.id && ed.id === edu.id) ? { ...ed, startDate: e.target.value } : ed)))}
                    placeholder="e.g. 2017-08"
                    className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">End Date</label>
                  <input
                    type="text"
                    value={edu.endDate || ''}
                    onChange={(e) => updateEducation(education.map((ed, i) => (i === idx || (ed.id && ed.id === edu.id) ? { ...ed, endDate: e.target.value } : ed)))}
                    placeholder="e.g. 2021-05 or Present"
                    className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">GPA / Score</label>
                  <input
                    type="text"
                    value={edu.gpa || edu.cgpa || ''}
                    onChange={(e) => updateEducation(education.map((ed, i) => (i === idx || (ed.id && ed.id === edu.id) ? { ...ed, gpa: e.target.value } : ed)))}
                    placeholder="e.g. 3.88 / 4.0"
                    className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-semibold text-slate-400">Relevant Coursework</label>
                <input
                  type="text"
                  value={edu.relevantCoursework || ''}
                  onChange={(e) => updateEducation(education.map((ed, i) => (i === idx || (ed.id && ed.id === edu.id) ? { ...ed, relevantCoursework: e.target.value } : ed)))}
                  placeholder="e.g. Algorithms & Data Structures, Operating Systems, Machine Learning"
                  className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
