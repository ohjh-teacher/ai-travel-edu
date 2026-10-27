(() => {
  const params = new URLSearchParams(window.location.search);
  const isLegacyCourseLink = params.has("week") || ["submit", "admin"].includes(params.get("view"));

  if (isLegacyCourseLink) {
    window.location.replace(`course.html${window.location.search}${window.location.hash}`);
  }
})();
