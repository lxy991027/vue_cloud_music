const _format = (item) => {
  return item.map((item) => {
    return {
      id: String(item.id),
      name: item.name,
      mvId: item.mv,
      singer: item.ar,
      album: item.al,
      alia: item.alia,
      vip: item.fee === 1,
      license: item.st === -1,
      duration: item.dt,
      // url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
      publishTime: item.publishTime,
      cloud: item.pc
    }
  })
}

export default { _format }
