import React from 'react';
import { FiBriefcase, FiCalendar } from 'react-icons/fi';

const ExperienceTimeline = ({ experienceBlocks = [] }) => {
    if (!experienceBlocks || experienceBlocks.length === 0) {
        return <div className="text-gray-500 italic">No experience data available to visualize.</div>;
    }

    // Sort blocks by start date descending
    const sortedBlocks = [...experienceBlocks].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    const formatDate = (dateString) => {
        if (!dateString) return 'Present';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <div className="relative border-l-2 border-blue-200 ml-3 space-y-8 py-4">
            {sortedBlocks.map((block, index) => (
                <div key={index} className="relative pl-8">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[9px] top-1 bg-white border-2 border-blue-500 rounded-full w-4 h-4"></div>

                    {/* Content */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                            <FiBriefcase className="text-blue-500" />
                            {block.role || 'Role Not Specified'}
                        </h4>
                        <div className="text-blue-600 font-medium mb-2">
                            {block.company || 'Company Not Specified'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2 mb-3">
                            <FiCalendar />
                            {formatDate(block.startDate)} - {formatDate(block.endDate)}
                        </div>

                        {/* Description */}
                        {block.description && block.description.length > 0 && (
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {block.description.slice(0, 3).map((desc, i) => (
                                    <li key={i} className="line-clamp-2">{desc}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExperienceTimeline;
