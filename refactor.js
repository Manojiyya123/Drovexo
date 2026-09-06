import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UI_REPLACEMENTS = [
    { from: /'New Order'/g, to: "'New Drop'" },
    { from: /'Order History'/g, to: "'Drop History'" },
    { from: /'All Orders'/g, to: "'All Drops'" },
    { from: />Orders</g, to: ">Drops<" },
    { from: />Order</g, to: ">Drop<" },
    { from: /> Orders</g, to: "> Drops<" },
    { from: /> Order</g, to: "> Drop<" },
    { from: />New Order</g, to: ">New Drop<" },
    { from: /'Orders Completed'/g, to: "'Drops Completed'" },
    { from: /start your first order/gi, to: "start your first drop" },
    { from: /alert\('Order/g, to: "alert('Drop" },
    { from: /alert\(`Order/g, to: "alert(`Drop" },
    { from: /alert\("Order/g, to: 'alert("Drop' },
    { from: /No orders /gi, to: "No drops " },
    { from: /No orders</gi, to: "No drops<" },
    { from: />Order ID</g, to: ">Drop ID<" },
    { from: /Historical Orders/g, to: "Historical Drops" },
    { from: /Total Logged Orders/g, to: "Total Logged Drops" },
    { from: /Active Live Orders/g, to: "Active Live Drops" },
    { from: />orders</g, to: ">drops<" },
    { from: />orders</gi, to: ">drops<" },
    { from: />Parcel/g, to: ">Drop" },
    { from: />Parcels</g, to: ">Drops" },
    { from: /> Parcel/g, to: "> Drop" },
    { from: /> Parcels</g, to: "> Drops" },
    { from: />Customer Parcels</g, to: ">Customer Drops<" },
    { from: /See Parcels/g, to: "See Drops" },
    { from: /Parcel:/g, to: "Drop:" },
    { from: /Order Date/g, to: "Drop Date" },
    { from: /Order Details/g, to: "Drop Details" },
    { from: />Available Orders</g, to: ">Available Drops<" },
    { from: /'s Parcels`/g, to: "'s Drops`" },
    { from: /Parcels Analytics/g, to: "Drops Analytics" },
    { from: /Parcel Tracker/g, to: "Drop Tracker" },
    { from: /Customer Parcels Tracker/g, to: "Customer Drops Tracker" },
    { from: />Parcels/g, to: ">Drops" },
    { from: /'Parcels'/g, to: "'Drops'" },
    { from: />Active Orders</g, to: ">Active Drops<" },
    { from: />Recent Orders</g, to: ">Recent Drops<" },
    { from: />Total Orders</g, to: ">Total Drops<" },
    { from: /Cancel Order/gi, to: "Cancel Drop" },
    { from: /Create Order/g, to: "Create Drop" },
    { from: />Order /g, to: ">Drop " },
    { from: /'s Orders/g, to: "'s Drops" },
    { from: /Customer's Orders/g, to: "Customer's Drops" }
];

function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            for (const r of UI_REPLACEMENTS) {
                content = content.replace(r.from, r.to);
            }
            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated: ' + fullPath);
            }
        }
    }
}
processDirectory(path.join(process.cwd(), 'src'));
