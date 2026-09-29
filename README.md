> **© 2026 Tahsin Sakin — TELİF HAKKI / COPYRIGHT. Tüm hakları saklıdır. All rights reserved.**
>
> Bu depo, kaynak kod, tasarım, metin, marka ve fikir **özel mülkiyettir**. Açık kaynak değildir. MIT yoktur.
> İzinsiz kopyalama, çoğaltma, dağıtma, tersine mühendislik, türetilmiş eser, ticari kullanım ve yeniden yayın **yasaktır**.
> Koruma: **5846 sayılı Fikir ve Sanat Eserleri Kanunu**, haksız rekabet hükümleri ve Bern Sözleşmesi.
> İhlalde ihtiyati tedbir, tazminat ve kanunun izin verdiği cezai şikayet yollarına başvurulur.
> İzin: tahcem17@gmail.com · Tam metin: [`LICENSE`](LICENSE)

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=1e3a5f&height=170&section=header&text=BudVia&fontSize=58&fontColor=f0e68c&animation=fadeIn&fontAlignY=36&desc=The%20trip%20stays%20on%20this%20phone&descAlignY=64&descSize=16" alt="BudVia" />
</p>

<p align="center">
  <a href="https://tahsinsakin.github.io/belvia/"><img src="https://img.shields.io/badge/live-tahsinsakin.github.io%2Fbelvia-f0e68c?style=for-the-badge&labelColor=1e3a5f" alt="live" /></a>
  <a href="INSTALL.md"><img src="https://img.shields.io/badge/install-iPhone%20%C2%B7%20Android-06b6d4?style=for-the-badge&labelColor=1e3a5f" alt="install" /></a>
  <img src="https://img.shields.io/badge/no%20account-no%20server-22c55e?style=for-the-badge&labelColor=1e3a5f" alt="private" />
  <img src="https://img.shields.io/badge/license-proprietary-b91c1c?style=for-the-badge&labelColor=1e3a5f" alt="proprietary" />
</p>

# Buying the ticket is easy. Keeping the trip together is not.

Cheap travel is split on purpose.

The lowest fare is on Wizz. The coach is on FlixBus. The room is on Airbnb or Booking. The city bike is another app. The dinner table is another one again. Each confirmation is cheap. Each confirmation lives in a different inbox. You spend a week assembling a trip out of five purchases, then spend the night before departure assembling those five purchases back into one trip.

BudVia is that second job.

Live: [tahsinsakin.github.io/belvia](https://tahsinsakin.github.io/belvia/)

---

## Install

Full steps: [`INSTALL.md`](INSTALL.md).

| Device | Path that works today |
|---|---|
| iPhone | Safari → [open BudVia](https://tahsinsakin.github.io/belvia/) → Share → **Add to Home Screen** |
| Android | Chrome → [open BudVia](https://tahsinsakin.github.io/belvia/) → menu → **Install app** |
| Google Play | Native bundle is prepared in `mobile/`. Listing copy is [`PLAY_STORE.md`](PLAY_STORE.md). Not live until Play accepts an AAB. |
| App Store | Listing copy is [`APP_STORE.md`](APP_STORE.md). Same rule. |

No sign-in. Privacy: [privacy.html](https://tahsinsakin.github.io/belvia/privacy.html).

---

## What it is

An on-device itinerary for trips you already booked.

It does not sell flights, coaches, or rooms. It is not a reservation site. It does not replace Wizz, FlixBus, Airbnb, or Booking. It holds the plan those apps refuse to hold together. A tap opens the same app you used to buy the ticket.

The trip sits in one place:

- Where it starts
- When it starts
- How early you leave
- When you need to be there
- The route
- What is in the bag
- What is next

No account. No server. No analytics. The plan stays on this phone.

This is beta. AI comes later. Then flights, coaches, rooms, routes, and times show in the app itself — in colour, with live alerts. Not a sample screen. Direct.

## What it is not

| Not this | This |
|---|---|
| A booking site | A register of bookings you already made |
| A new ticket app | A tap that opens the app you already use |
| A cloud product | Storage on this device |
| A tracking product | No login, no backend, no analytics |
| Travel advice | The itinerary you actually have |

PWA data: `localStorage` key `belvia-v2`.

## Screens

| Screen | Purpose |
|---|---|
| Trip | Name, two days, next action |
| Plan | One row. One time. |
| Places | Pins. Map opens outside. |
| Bag | Tick what is in the bag. |
| Tickets | One card for each ticket. |

```mermaid
flowchart LR
  A[Wizz / FlixBus / Airbnb / Booking] -->|already bought| B[BudVia]
  B --> C[Plan]
  B --> D[Places]
  B --> E[Bag]
  B -->|tap opens the same app| A
```

## Publisher

Tahsin Sakin  
Information Systems Engineer · Ankara  
[linkedin.com/in/tahsin-sakin-390961199](https://www.linkedin.com/in/tahsin-sakin-390961199)

An idiot admires complexity, a genius admires simplicity.  
— Terry A. Davis

Proprietary. All rights reserved. See `LICENSE`.
