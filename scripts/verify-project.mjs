import {existsSync, readFileSync} from 'node:fs';
import vm from 'node:vm';

const required=[
 'README.md','DEPLOYMENT-GUIDE.md','CUSTOMIZATION-GUIDE.md',
 'database/schema.sql','database/schema-hosting.sql',
 'backend/api/index.php','backend/api/.htaccess','backend/config/database.php',
 'professional-interface-demo/index.html','professional-interface-demo/app.js',
 'react-frontend/src/main.jsx','angularjs-frontend/app.js',
 'deployment-package/public_html/index.html','deployment-package/public_html/api/index.php',
 'deployment-package/public_html/.htaccess'
];
const missing=required.filter(file=>!existsSync(file));
if(missing.length)throw new Error(`Missing files: ${missing.join(', ')}`);

new vm.Script(readFileSync('professional-interface-demo/app.js','utf8'));
new vm.Script(readFileSync('angularjs-frontend/app.js','utf8'));

const sql=readFileSync('database/schema-hosting.sql','utf8');
for(const table of ['tutors','help_requests','study_rooms','room_members']){
 if(!sql.includes(`CREATE TABLE ${table}`) && !sql.includes(`CREATE TABLE IF NOT EXISTS ${table}`))throw new Error(`Missing SQL table: ${table}`);
}
const php=readFileSync('backend/api/index.php','utf8');
for(const route of ["'tutors'","'requests'","'rooms'","'join-room'","'health'"]){
 if(!php.includes(route))throw new Error(`Missing PHP route: ${route}`);
}
const html=readFileSync('deployment-package/public_html/index.html','utf8');
for(const asset of ['app.js','style.css','asia.css']){
 if(!html.includes(asset))throw new Error(`Missing HTML asset reference: ${asset}`);
}
console.log(`PASS: ${required.length} essential files, JavaScript syntax, 4 SQL tables, 5 API routes and deployment assets verified.`);
