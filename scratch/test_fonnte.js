const token = 'TLixVvwq3eFzdqxf221YzUm7';
fetch('https://api.fonnte.com/qr', {
  method: 'POST',
  headers: { Authorization: token },
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
