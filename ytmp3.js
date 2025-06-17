import ytdl from "ytdl-core";

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ status: false, error: "Invalid or missing YouTube URL" });
  }
  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });
    res.json({
      status: true,
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      duration: info.videoDetails.lengthSeconds,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      mp3_url: format.url
    });
  } catch (err) {
    res.status(500).json({ status: false, error: "Processing error", details: err.message });
  }
}
