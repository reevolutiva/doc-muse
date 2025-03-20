const ProjectFields = ({ 
    nodeName, 
    setNodeName, 
    nodeDescription, 
    setNodeDescription, 
    isRequired, 
    setIsRequired, 
    aiPrompt, 
    setAiPrompt, 
    entity, 
 }) => {
    return ( 
        <div className="project-fields">

            <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
                Name
                <input
                type="text"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder={`${entity} name`}
                />
            </label>
            </div>

            <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
                Description
                <textarea
                value={nodeDescription}
                onChange={(e) => setNodeDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder={`${entity} description`}
                rows={3}
                />
            </label>
            </div>

            <div className="flex items-center gap-2">
            <input
                type="checkbox"
                id="isRequired"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isRequired" className="text-sm font-medium text-gray-700">
                Required
            </label>
            </div>

            <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
                AI Prompt
                <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="AI prompt for content generation"
                rows={3}
                />
            </label>
            </div>
        </div>
     );
}
 
export default ProjectFields;