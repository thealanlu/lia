"""Package the static site for GitHub Pages' /lia/ project path."""
from pathlib import Path
import shutil
source=Path('website')
target=Path('_site')
if target.exists(): shutil.rmtree(target)
shutil.copytree(source,target)
for p in target.rglob('*'):
    if p.suffix in ('.html','.css'):
        s=p.read_text()
        if p.suffix=='.html':
            for attr in ('href','src','action'):
                s=s.replace(f'{attr}="/',f'{attr}="/lia/')
            s=s.replace('srcset="/assets/','srcset="/lia/assets/').replace(', /assets/',', /lia/assets/')
        else:
            s=s.replace("url('/assets/","url('/lia/assets/")
        p.write_text(s)
# Tracking is injected only into GitHub Pages output, never the shared website source.
shutil.copyfile(Path('scripts/tracking-github.js'), target/'assets/lia-intelligence.js')
for page in target.rglob('*.html'):
    markup=page.read_text()
    markup=markup.replace('<head>', '<head><script src="/lia/assets/lia-intelligence.js?v=20261030-integrated" defer></script>')
    page.write_text(markup)
(target/'.nojekyll').touch()
