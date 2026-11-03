/** Turns a Google Drive or YouTube share link into an embeddable player URL and a thumbnail. */
export function videoInfo(url?: string): { embed: string; thumb: string; native?: boolean } | null {
  if (!url) return null;

  // A video file stored in /public (e.g. /videos/my-edit.mp4) plays in a normal <video> player.
  if (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url)) {
    return { embed: url, thumb: "", native: true };
  }

  const drive = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)/);
  if (drive) {
    const id = drive[1];
    return {
      embed: `https://drive.google.com/file/d/${id}/preview`,
      thumb: `https://drive.google.com/thumbnail?id=${id}&sz=w1600`,
    };
  }

  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) {
    const id = yt[1];
    return {
      embed: `https://www.youtube.com/embed/${id}`,
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }

  return null;
}
