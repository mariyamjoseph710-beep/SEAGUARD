// app.js — handles real-time updates from WebSocket
const ws = new WebSocket("ws://localhost:8080");

ws.onopen = () => console.log("✅ Connected to SEAGUARD boat");
ws.onclose = () => console.log("❌ Disconnected");
ws.onerror  = () => console.log("⚠️ Connection error");

ws.onmessage = (event) => {
  const line = event.data.trim();
  const pairs = line.split(",");
  let data = {};

  pairs.forEach(p => {
    const [k, v] = p.split("=");
    data[k] = v;
  });

  document.getElementById("weight").textContent   = data.WEIGHT  || 0;
  document.getElementById("capacity").textContent = data.CAP     || 0;
  document.getElementById("roll").textContent     = data.ROLL    || 0;
  document.getElementById("pitch").textContent    = data.PITCH   || 0;

  const seaStates = ["Calm", "Moderate", "Rough"];
  document.getElementById("sea").textContent = seaStates[parseInt(data.SEA) || 0];

  const alarmText = document.getElementById("alarm");
  if (data.ALARM == "1") {
    alarmText.textContent = "ACTIVE";
    alarmText.parentElement.style.background = "red";
  } else {
    alarmText.textContent = "OFF";
    alarmText.parentElement.style.background = "#004b8d";
  }
};
