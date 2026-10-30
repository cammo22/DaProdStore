const $ = selector => document.querySelector(selector);
const productsEl = $('#products'), count = $('#count'), category = $('#category'), platform = $('#platform'), search = $('#search');
const dialog = $('#download'), releaseContent = $('#release-content');
let products = [];
const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
function link(text, href, className) { const a = el('a', className, text); a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a; }
function render() {
  const q = search.value.trim().toLocaleLowerCase('it');
  const filtered = products.filter(p => (!category.value || p.categoria === category.value) && (!platform.value || p.piattaforme.includes(platform.value)) && [p.nome,p.descrizione,p.categoria,...p.piattaforme].join(' ').toLocaleLowerCase('it').includes(q));
  productsEl.replaceChildren();
  count.textContent = `${filtered.length} ${filtered.length === 1 ? 'PRODOTTO' : 'PRODOTTI'}`;
  $('#empty').hidden = filtered.length > 0;
  filtered.forEach(p => {
    const card = el('article','card'), top = el('div','card-top'), art = el('div','art');
    art.setAttribute('aria-hidden','true'); art.textContent = p.nome.replace(/DaProd\s*/i,'').trim().slice(0,2).toUpperCase() || 'DP';
    if (p.immagine) { const placeholder = art.textContent; const img = document.createElement('img'); img.src = p.immagine; img.alt = ''; img.loading = 'lazy'; img.addEventListener('error',()=>{ art.textContent = placeholder; }); art.replaceChildren(img); }
    top.append(art,el('span',`status${p.stato === 'in arrivo' ? ' soon' : ''}`,p.stato === 'in arrivo' ? '● IN ARRIVO' : '● DISPONIBILE'));
    const tags = el('div','tags'); [p.categoria,...p.piattaforme].forEach(t => tags.append(el('span','',t)));
    const actions = el('div','card-actions');
    if (p.gioca) actions.append(link('▶ Gioca',p.gioca,'action play'));
    if (p.stato === 'disponibile') { const btn = el('button','action','↓ Scarica'); btn.type='button'; btn.setAttribute('aria-label',`Scarica ${p.nome}`); btn.addEventListener('click',()=>openRelease(p)); actions.append(btn); }
    actions.append(link('Codice ↗',`https://github.com/${p.repo}`,'secondary'));
    card.append(top,el('h3','',p.nome),el('p','',p.descrizione),tags,actions); productsEl.append(card);
  });
}
function system() { const ua = navigator.userAgent.toLowerCase(); if (/android/.test(ua)) return 'android'; if (/windows/.test(ua)) return 'windows'; if (/macintosh|mac os/.test(ua)) return 'macos'; if (/linux/.test(ua)) return 'linux'; return ''; }
function assetKind(name) { const n=name.toLowerCase(); if (n.endsWith('.exe')) return 'windows'; if (n.endsWith('.dmg')) return 'macos'; if (n.endsWith('.apk')) return 'android'; if (/\.(appimage|deb|rpm)$/.test(n)) return 'linux'; if (/portable|portatile/.test(n) && /\.zip$/.test(n)) return /win/.test(n) ? 'windows' : ''; return ''; }
function score(asset, os) { const n=asset.name.toLowerCase(), kind=assetKind(n); if (!os || kind !== os) return -100; let s=10; if (/setup|installer/.test(n)) s+=5; if (/portable|portatile/.test(n)) s-=1; if (/demo/.test(n)) s-=3; return s; }
async function openRelease(p) {
  $('#dialog-title').textContent = p.nome; releaseContent.replaceChildren(el('p','release-meta','Cerco l’ultima release…')); dialog.showModal();
  const fallback = `https://github.com/${p.repo}/releases`;
  try {
    const key = `release:${p.repo}`; let data; try { const stored = sessionStorage.getItem(key); if (stored) data=JSON.parse(stored); } catch (_) {}
    if (!data) { const response = await fetch(`https://api.github.com/repos/${p.repo}/releases/latest`, {headers:{Accept:'application/vnd.github+json'}}); if (!response.ok) throw new Error('API'); data=await response.json(); try { sessionStorage.setItem(key,JSON.stringify(data)); } catch (_) {} }
    if ($('#dialog-title').textContent !== p.nome || !dialog.open) return;
    releaseContent.replaceChildren();
    const date = data.published_at ? new Date(data.published_at).toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'}) : 'data non disponibile';
    releaseContent.append(el('p','release-meta',`${data.tag_name || 'Ultima release'} · ${date}`));
    const assets=(data.assets || []).filter(a => assetKind(a.name)); const os=system(); const ranked=[...assets].sort((a,b)=>score(b,os)-score(a,os)); const best=ranked.length && score(ranked[0],os)>=0 ? ranked[0] : null;
    if (!best) releaseContent.append(el('p','release-meta','Nessun file riconosciuto per questo dispositivo. Scegli tra quelli disponibili.'));
    if (ranked.length) { const list=el('div','asset-list'); ranked.forEach(a=>{ const kind=assetKind(a.name); const labels={windows:'Windows',macos:'macOS',android:'Android',linux:'Linux'}; const item=link('',a.browser_download_url,'asset'+(a===best?' recommended':'')); const title=el('strong','',a===best?'CONSIGLIATO · '+labels[kind]:labels[kind]); item.append(title,el('small','',a.name)); list.append(item); }); releaseContent.append(list); }
    else releaseContent.append(el('p','release-meta','Nessun file riconosciuto. Apri la pagina delle release per tutte le opzioni.'));
    releaseContent.append(link('Tutte le release su GitHub ↗',fallback,'fallback'));
  } catch (_) { if ($('#dialog-title').textContent !== p.nome || !dialog.open) return; releaseContent.replaceChildren(el('p','release-meta','Non riesco a leggere la release. Puoi aprire la pagina su GitHub.'),link('Apri le release su GitHub ↗',fallback,'fallback')); }
}
$('#close').addEventListener('click',()=>dialog.close()); dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
[category,platform].forEach(x=>x.addEventListener('change',render)); search.addEventListener('input',render);
fetch('prodotti.json').then(r=>{if(!r.ok)throw new Error('catalogo');return r.json()}).then(data=>{ products=data; for (const [select,values] of [[category,products.map(p=>p.categoria)],[platform,products.flatMap(p=>p.piattaforme)]]) [...new Set(values)].sort((a,b)=>a.localeCompare(b,'it')).forEach(value=>{const option=el('option','',value);option.value=value;select.append(option)}); render(); }).catch(()=>{count.textContent='CATALOGO NON DISPONIBILE';$('#error').hidden=false;});
