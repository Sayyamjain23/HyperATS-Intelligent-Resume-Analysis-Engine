import React from 'react';
import { FiBriefcase } from 'react-icons/fi';

const JobDescription = ({ jobDescription, setJobDescription }) => {
    return (
        <div className="card animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiBriefcase className="text-purple-600" />
                Job Description
            </h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste Job Description
                </label>
                <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description you're applying for..."
                    className="input-field min-h-[200px] resize-y"
                    rows={10}
                />
                <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">
                        {jobDescription.length} characters
                    </p>
                    {jobDescription.length > 0 && (
                        <span className="badge-success">
                            ✓ Job description added
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDescription;
