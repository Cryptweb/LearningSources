// Note : this whitelist is not secure at all and should not be used for a paid script.

// Modules
const express = require('express') // Required for server
const app = express() // Init express
const bP = require('body-parser') // Idk how to explain
const crypto = require('crypto') // Used for hashing

// Secret keys
const secret1 = 'GYW6dk8{Z5rnzDPHSaR-fB7E'; // Make sure it is atleast 24 characters long and is hard to rewrite.
const secret2 = 'GzsTENr2m9PU-XiBU5oX3Dgj'; // Same as above

// Exploit fingerprints, current HWID.
const Fingerprints =
{
    Syn: 'Syn-Fingerprint',
    Krnl: 'Krnl-Hwid',
    SW: 'Fingerprint',
    HWID: ''
}

// Makes it so express uses body parser
app.use(bP());

// Hashing function
const hmac = (secret, data) => {
    const hash = crypto.createHash('sha512');
    hash.update(secret + data + secret);
    return hash.digest('hex').toString();
};

// Main server
app.get('/wl/getHWID', function(req, res) { // Get HWID
    if (req.header(Fingerprints.Syn)) { // If the user is using synapse
        Fingerprints.HWID = req.header(Fingerprints.Syn); // Put their HWID in the array
    } else if (req.header(Fingerprints.SW)) { // If the user is using scriptware
        Fingerprints.HWID = req.header(Fingerprints.SW); // Put their HWID in the array
    } else if (req.header(Fingerprints.Krnl)) { // If the user is using Krnl
        Fingerprints.HWID = req.header(Fingerprints.Krnl); // Put their HWID in the array
    } else { // If the user's exploit is not supported
        Fingerprints.HWID = 'unsupported';
    };

    res.end('') // end
})

app.get('/wl/check', async function(req, res) { // Checks if the HWID is in the database
    const HWIDS = 
    [
        'D643C5D8765FDF6769AFBD8D8B0272C37204AE72B694D6B18670EAE193AF1FD2'
    ]; // Our HWID 'database' array

    if (HWIDS.includes(Fingerprints.HWID)) { // If the HWID 'database' array includes the user's HWID
        res.write(hmac('success' + secret2, secret1, secret1 + 'whitelisted')); // Write a response (static)
        res.end('') // end
    } else { // If it doesn't
        res.write('Not Whitelisted!') // Write a response, that the user is not whitelisted
        res.end('') // end
    }
})

const port = 8080;

app.listen(port, () => {
    console.log('Listening to: ', port)
})
