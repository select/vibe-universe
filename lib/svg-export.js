/**
 * SVG Export Utility
 * Provides keyboard shortcut ('d' key) to export Paper.js project as SVG
 * and copy it to clipboard with visual feedback
 */

// Make functions available globally
window.SvgExport = window.SvgExport || {};

/**
 * Initialize SVG export functionality with 'd' key shortcut
 * @param {object} paperProject - The Paper.js project instance (paper.project)
 * @param {object} options - Configuration options
 * @param {string} options.key - Key to trigger export (default: 'd')
 * @param {boolean} options.ctrlKey - Require Ctrl key (default: false)
 * @param {boolean} options.altKey - Require Alt key (default: false)
 * @param {boolean} options.shiftKey - Require Shift key (default: false)
 * @param {boolean} options.copyToClipboard - Copy SVG to clipboard (default: true)
 * @param {boolean} options.logToConsole - Log SVG to console (default: true)
 * @param {boolean} options.visualFeedback - Show visual feedback on success (default: true)
 * @param {string} options.feedbackColor - Background color for feedback (default: '#004d00')
 * @param {number} options.feedbackDuration - Duration of feedback in ms (default: 200)
 */
window.SvgExport.initSvgExport = function (paperProject, options = {}) {
  const config = {
    key: options.key || "d",
    ctrlKey: options.ctrlKey || false,
    altKey: options.altKey || false,
    shiftKey: options.shiftKey || false,
    copyToClipboard: options.copyToClipboard !== false,
    logToConsole: options.logToConsole !== false,
    visualFeedback: options.visualFeedback !== false,
    feedbackColor: options.feedbackColor || "#004d00",
    feedbackDuration: options.feedbackDuration || 200,
  };

  document.addEventListener("keydown", function (event) {
    const keyMatch = event.key === config.key;
    const ctrlMatch = config.ctrlKey ? event.ctrlKey : !event.ctrlKey;
    const altMatch = config.altKey ? event.altKey : !event.altKey;
    const shiftMatch = config.shiftKey ? event.shiftKey : !event.shiftKey;

    if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
      const svg = paperProject.exportSVG({ asString: true });

      if (config.logToConsole) {
        console.log("SVG content exported");
      }

      if (config.copyToClipboard) {
        navigator.clipboard
          .writeText(svg)
          .then(() => {
            console.log("SVG content copied to clipboard.");

            if (config.visualFeedback) {
              const originalColor = document.body.style.backgroundColor;
              document.body.style.backgroundColor = config.feedbackColor;
              setTimeout(() => {
                document.body.style.backgroundColor = originalColor;
              }, config.feedbackDuration);
            }
          })
          .catch((err) => {
            console.error("Failed to copy SVG content: ", err);
          });
      }

      return svg;
    }
  });
};

/**
 * Export SVG programmatically without clipboard
 * @param {object} paperProject - The Paper.js project instance
 * @returns {string} SVG string
 */
window.SvgExport.exportSvg = function (paperProject) {
  return paperProject.exportSVG({ asString: true });
};

/**
 * Export and download SVG as file
 * @param {object} paperProject - The Paper.js project instance
 * @param {string} filename - Filename for the download (default: 'export.svg')
 */
window.SvgExport.downloadSvg = function (
  paperProject,
  filename = "export.svg",
) {
  const svg = paperProject.exportSVG({ asString: true });
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
