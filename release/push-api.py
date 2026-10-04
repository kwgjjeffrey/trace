#!/usr/bin/env python3
"""Push a clean source tree via GitHub Git Data API when Git HTTPS is unavailable."""
import base64,concurrent.futures,datetime,hashlib,json,pathlib,subprocess
REPO='kwgjjeffrey/trace'
def git(*args):return subprocess.check_output(['git',*args]).decode().strip()
def api(route,data=None):
 args=['gh','api','repos/'+REPO+'/'+route]
 if data is not None:args+=['--method','POST','--input','-']
 return json.loads(subprocess.check_output(args,input=None if data is None else json.dumps(data).encode()))
def import_commit(sha):
 c=api('git/commits/'+sha);v=c.get('verification',{})
 if v.get('payload'):
  payload=v['payload'];head,body=payload.split('\n\n',1);raw=head+'\ngpgsig '+v['signature'].rstrip('\n').replace('\n','\n ')+'\n\n'+body
 else:
  def person(role,offset):
   p=c[role];t=int(datetime.datetime.fromisoformat(p['date'].replace('Z','+00:00')).timestamp());return f"{role} {p['name']} <{p['email']}> {t} {offset}"
  offsets=['+0000']+[('-' if n<0 else '+')+f'{abs(n)//60:02d}{abs(n)%60:02d}' for n in range(-720,841,15)]
  prefix='tree '+c['tree']['sha']+'\n'+''.join('parent '+p['sha']+'\n' for p in c['parents']);raw=None
  for offset in offsets:
   for ending in ['', '\n']:
    candidate=prefix+person('author',offset)+'\n'+person('committer',offset)+'\n\n'+c['message']+ending
    encoded=candidate.encode()
    if hashlib.sha1(f'commit {len(encoded)}\0'.encode()+encoded).hexdigest()==sha:raw=candidate;break
   if raw is not None:break
  if raw is None:raise RuntimeError('Unsupported Git commit metadata')
 actual=subprocess.check_output(['git','hash-object','-t','commit','-w','--stdin'],input=raw.encode()).decode().strip()
 if actual!=sha:raise RuntimeError('Cannot reconstruct GitHub commit; no local ref changed')
 return c
if git('status','--porcelain'):raise SystemExit('Commit source before API push')
try:ref=api('git/ref/heads/main')
except subprocess.CalledProcessError:
 content=base64.b64encode(pathlib.Path('README.md').read_bytes()).decode();data={'message':'Initialize trace repository','content':content,'author':{'name':'kwgjjeffrey','email':'10330620+kwgjjeffrey@users.noreply.github.com'},'committer':{'name':'kwgjjeffrey','email':'10330620+kwgjjeffrey@users.noreply.github.com'}}
 result=json.loads(subprocess.check_output(['gh','api','repos/'+REPO+'/contents/README.md','--method','PUT','--input','-'],input=json.dumps(data).encode()));ref={'object':{'sha':result['commit']['sha']}}
parent=ref['object']['sha'];import_commit(parent)
files=git('ls-files').splitlines()
def blob(file):
 data=pathlib.Path(file).read_bytes();b=api('git/blobs',{'content':base64.b64encode(data).decode(),'encoding':'base64'});return {'path':file,'mode':'100755' if pathlib.Path(file).stat().st_mode&0o111 else '100644','type':'blob','sha':b['sha']}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:entries=list(pool.map(blob,files))
tree=api('git/trees',{'tree':entries})['sha'];assert tree==git('rev-parse','HEAD^{tree}')
date=datetime.datetime.now(datetime.timezone.utc).isoformat();person={'name':'kwgjjeffrey','email':'10330620+kwgjjeffrey@users.noreply.github.com','date':date};commit=api('git/commits',{'message':git('log','-1','--format=%B'),'tree':tree,'parents':[parent],'author':person,'committer':person})['sha'];import_commit(commit)
subprocess.run(['gh','api','repos/'+REPO+'/git/refs/heads/main','--method','PATCH','--input','-'],input=json.dumps({'sha':commit,'force':False}).encode(),check=True,stdout=subprocess.DEVNULL)
subprocess.run(['git','update-ref','refs/heads/main',commit],check=True);subprocess.run(['git','update-ref','refs/remotes/origin/main',commit],check=True);print(json.dumps({'pushed':commit,'tree':tree}))
