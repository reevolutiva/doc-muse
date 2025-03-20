"use client";

function getUrlParameter() {
  
    // Si la url no tiene el id del template, no se hace nada
    if (typeof window === 'undefined' || !window.location || !window.location.href.includes("id=")) {
      return;
  }
  
    const urlParams = new URLSearchParams(window.location.search);
    const tempalte_id = urlParams.get('id');
    const type = urlParams.get('type');
  
    const table = type === "document" ? "document_templates" : "project_templates";
  
    return { tempalte_id, type, table };
  }
  
export default getUrlParameter;