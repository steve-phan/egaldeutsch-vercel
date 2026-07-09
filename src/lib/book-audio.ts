function escapeAttribute(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function renderAudioPlayers(contentHtml: string) {
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

function collapseAudioTranscripts(contentHtml: string) {
  return contentHtml.replace(
    /(<div class="not-prose my-5 rounded-2xl border border-emerald-100 bg-emerald-50\/70 p-4">[\s\S]*?<\/div>)\s*<blockquote>\s*<p>([\s\S]*?)<\/p>\s*<\/blockquote>/g,
    (_match, audioPlayer: string, transcript: string) => [
      audioPlayer,
      '<details class="not-prose my-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">',
      '<summary class="flex cursor-pointer select-none items-center justify-between gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-600 marker:content-none">',
      '<span>Transkript anzeigen</span>',
      '<span class="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-500">nach dem Hören</span>',
      "</summary>",
      '<div class="border-t border-slate-100 bg-slate-50 px-4 py-4 text-base font-semibold leading-8 text-slate-700 sm:text-lg">',
      `<p>${transcript}</p>`,
      "</div>",
      "</details>",
    ].join(""),
  );
}

function renderAnswerOptionParagraphs(contentHtml: string) {
  const renderOptions = (options: RegExpMatchArray[]) => [
    '<div class="not-prose my-5 grid gap-2">',
    ...options.map((option) => {
      const label = option[1];
      const text = option[2].trim();

      return [
        '<div class="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-base font-semibold leading-7 text-slate-700">',
        `<span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-primary shadow-sm">${label}</span>`,
        `<span>${text}</span>`,
        "</div>",
      ].join("");
    }),
    "</div>",
  ].join("");

  const withMultilineOptions = contentHtml.replace(
    /<p>(\s*a\)\s+[\s\S]*?\n\s*b\)\s+[\s\S]*?)<\/p>/g,
    (_match, optionsText: string) => {
      const options = Array.from(
        optionsText.matchAll(/(?:^|\n)\s*([a-d]\))\s+([\s\S]*?)(?=\n\s*[a-d]\)\s+|$)/g),
      );

      if (options.length < 2) {
        return `<p>${optionsText}</p>`;
      }

      return renderOptions(options);
    },
  );

  return withMultilineOptions.replace(
    /((?:<p>\s*[a-d]\)\s+[\s\S]*?<\/p>\s*){2,4})/g,
    (match: string) => {
      const options = Array.from(
        match.matchAll(/<p>\s*([a-d]\))\s+([\s\S]*?)<\/p>/g),
      );

      if (options.length < 2) {
        return match;
      }

      return renderOptions(options);
    },
  );
}

function answerDetails(label: string, content: string) {
  return [
    '<details class="not-prose my-5 overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/60 shadow-sm">',
    '<summary class="flex cursor-pointer select-none items-center justify-between gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-amber-800 marker:content-none">',
    `<span>${label}</span>`,
    '<span class="rounded-full bg-white/80 px-2 py-1 text-[10px] text-amber-700">anzeigen</span>',
    "</summary>",
    '<div class="prose prose-slate max-w-none border-t border-amber-100 bg-white px-4 py-4 prose-p:my-2 prose-li:my-1">',
    content,
    "</div>",
    "</details>",
  ].join("");
}

function collapseAnswerSections(contentHtml: string) {
  const withAnswerSections = contentHtml.replace(
    /<h2>(Lösung(?:en)?|Antwort(?:en)?)<\/h2>\s*([\s\S]*?)(?=<hr>|<h1>|<h2>|$)/gi,
    (_match, heading: string, answerContent: string) =>
      answerDetails(heading, answerContent.trim()),
  );

  return withAnswerSections.replace(
    /<p>(Lösung(?:en)?|Antwort(?:en)?):?<\/p>\s*((?:<blockquote>[\s\S]*?<\/blockquote>|<ol>[\s\S]*?<\/ol>|<ul>[\s\S]*?<\/ul>|<p>[\s\S]*?<\/p>))/gi,
    (_match, heading: string, answerContent: string) =>
      answerDetails(heading, answerContent.trim()),
  );
}

function renderAnswerOptionsOutsideDetails(contentHtml: string) {
  return contentHtml
    .split(/(<details[\s\S]*?<\/details>)/g)
    .map((segment) =>
      segment.startsWith("<details") ? segment : renderAnswerOptionParagraphs(segment),
    )
    .join("");
}

export function renderBookAudioMarkers(contentHtml: string) {
  return renderAnswerOptionsOutsideDetails(
    collapseAnswerSections(collapseAudioTranscripts(renderAudioPlayers(contentHtml))),
  );
}
