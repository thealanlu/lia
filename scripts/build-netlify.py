"""Keep cross-host form posting in source; provide Netlify a local action for detection."""
from pathlib import Path
import shutil
source = Path('website')
target = Path('.netlify-public')
if target.exists():
    shutil.rmtree(target)
shutil.copytree(source, target)
p = target / 'inquire/index.html'
s = p.read_text()
external = 'action="https://logos-international-academy.netlify.app/request-info/?sent=1"'
assert s.count(external) == 1
s = s.replace(external, 'action="/request-info/?sent=1"')
p.write_text(s)
assert all('name="' + key + '"' in s for key in ['lia-source', 'lia-session', 'lia-page-id'])
print('Prepared Netlify HTML with local form action and unchanged GitHub source.')
