const fs = require('fs');
const path = require('path');

const UI_REPLACEMENTS = [
    // Navigation & Layout
    { from: /'New Order'/g, to: "'New Drop'" },
    { from: /'Order History'/g, to: "'Drop History'" },
    { from: /'All Orders'/g, to: "'All Drops'" },
    { from: />Orders</g, to: ">Drops<" },
    { from: />Order</g, to: ">Drop<" },
    { from: /> Orders</g, to: "> Drops<" },
    { from: /> Order</g, to: "> Drop<" },
    { from: />New Order</g, to: ">New Drop<" },

    // Auth & Home
    { from: /'Orders Completed'/g, to: "'Drops Completed'" },
    { from: /start your first order/gi, to: "start your first drop" },

    // Alerts & Placeholders
    { from: /alert\('Order/g, to: "alert('Drop" },
    { from: /alert\(`Order/g, to: "alert(`Drop" },
    { from: /alert\("Order/g, to: 'alert("Drop' },
    { from: /No orders /g, to: "No drops " },
    { from: /No orders</g, to: "No drops<" },

    // Labels & Table Headers
    { from: />Order ID</g, to: ">Drop ID<" },
    { from: /Historical Orders/g, to: "Historical Drops" },
    { from: /Total Logged Orders/g, to: "Total Logged Drops" },
    { from: /Active Live Orders/g, to: "Active Live Drops" },
    { from: />orders</g, to: ">drops<" },
    { from: />Orders</g, to: ">Drops<" },
    { from: />Parcel/g, to: ">Drop" },
    { from: />Parcels</g, to: ">Drops" },
    { from: /> Parcel</g, to: "> Drop" },
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
    { from: /Cancel Order/gi, to: "Cancel Drop" }
];

function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.html') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            for (const r of UI_REPLACEMENTS) {
                content = content.replace(r.from, r.to);
            }

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated UI Text in: ${fullPath}`);
            }
        }
    }
}

// Ensure execution directory is src
processDirectory(path.join(__dirname, 'src'));
processDirectory(path.join(__dirname, 'public'));
if (fs.existsSync(path.join(__dirname, 'index.html'))) {
    let content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    let original = content;
    for (const r of UI_REPLACEMENTS) { content = content.replace(r.from, r.to); }
    if (content !== original) {
        fs.writeFileSync(path.join(__dirname, 'index.html'), content, 'utf8');
        console.log(`Updated index.html`);
    }
}
