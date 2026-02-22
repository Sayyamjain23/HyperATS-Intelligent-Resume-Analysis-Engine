import React, { useState } from 'react';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';

const ResumeUpload = ({ resumeText, setResumeText, resumeFile, setResumeFile }) => {
    const [inputMode, setInputMode] = useState('text'); // 'text' or 'file'

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setResumeFile(file);
            setResumeText(''); // Clear text input when file is uploaded
        } else if (file) {
            alert('Please upload a PDF file');
            e.target.value = '';
        }
    };

    const removeFile = () => {
        setResumeFile(null);
    };

    const handleTextChange = (e) => {
        setResumeText(e.target.value);
        setResumeFile(null); // Clear file when text is entered
    };

    return (
        <div className="card animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiUpload className="text-blue-600" />
                Resume Input
            </h2>

            {/* Toggle between file and text input */}
            <div className="flex gap-3 mb-4">
                <button
                    onClick={() => setInputMode('text')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${inputMode === 'text'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Paste Text
                </button>
                <button
                    onClick={() => setInputMode('file')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${inputMode === 'file'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Upload PDF
                </button>
            </div>

            {inputMode === 'text' ? (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Paste Resume Text
                    </label>
                    <textarea
                        value={resumeText}
                        onChange={handleTextChange}
                        placeholder="Paste your resume content here..."
                        className="input-field min-h-[200px] resize-y font-mono text-sm"
                        rows={10}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                        {resumeText.length} characters
                    </p>
                </div>
            ) : (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Resume PDF
                    </label>

                    {!resumeFile ? (
                        <label className="block cursor-pointer">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all">
                                <FiUpload className="mx-auto text-4xl text-gray-400 mb-3" />
                                <p className="text-gray-600 font-medium mb-1">
                                    Click to upload PDF
                                </p>
                                <p className="text-sm text-gray-500">
                                    Maximum file size: 5MB
                                </p>
                            </div>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    ) : (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FiFile className="text-2xl text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-800">{resumeFile.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {(resumeFile.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={removeFile}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <FiX className="text-2xl" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResumeUpload;
