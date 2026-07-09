function escapeAttribute(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

export function renderBookAudioMarkers(contentHtml: string) {
  return contentHtml.replace(
    /<p>\{\{audio:([^}<]+\.mp3)\}\}<\/p>/g,
    (_match, audioPath: string) => {
      const safePath = escapeAttribute(audioPath.trim());

      return [
        '<div class="not-prose my-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">',
        '<p class="mb-3 text-xs font-black uppercase tracking-widest text-emerald-700">🎧 Hörtext-Audio</p>',
        `<audio controls preload="metadata" class="w-full" src="${safePath}">`,
        `<a href="${safePath}">Audio herunterladen</a>`,
        "</audio>",
        "</div>",
      ].join("");
    },
  );
}
