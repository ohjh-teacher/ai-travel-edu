(() => {
  const params = new URLSearchParams(window.location.search);
  const isLegacyCourseLink = params.has("week") || params.get("view") === "submit";

  if (isLegacyCourseLink) {
    window.location.replace(`course.html${window.location.search}${window.location.hash}`);
  }
})();
