const indexedDB = 
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

let budgetdb;

const request = indexedDB.open("budgetdb", 1);

request.onupgradeneeded = ({target}) => {
    let budgetdb = target.result;
    budgetdb.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = ({target}) => {
    budgetdb = target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function (err) {
    console.log("An error occured" + err.target.errorCode);
};

function saveRecord(saved) {
    const transaction = budgetdb.transaction(["pending"], "readwrite");
    const objStore = transaction.objectStore("pending");

    objStore.add(saved)
}

function checkDatabase() {
    const transaction = budgetdb.transaction(["pending"], "readwrite");
    const objStore = transaction.objectStore("pending");
    const getAll = objStore.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-type": "application.json"
                }
            })
                .then(res => {
                    return res.json();
                })
                .then(() => {
                    const transaction = budgetdb.transaction(["pending"], "readwrite");
                    const objStore = transaction.objectStore("pending");
                    objStore.clear();
                });
        }
    };
};