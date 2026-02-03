from __future__ import annotations

from datetime import date
from typing import List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Couples Compatibility API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BirthTime(BaseModel):
    hour: int = Field(ge=0, le=23)
    minute: int = Field(ge=0, le=59)


class Partner(BaseModel):
    name: Optional[str] = None
    birth_date: date
    birth_time: Optional[BirthTime] = None


class CompatibilityRequest(BaseModel):
    partner_a: Partner
    partner_b: Partner


class CompatibilityResponse(BaseModel):
    score: int
    summary_en: str
    summary_ka: str
    highlights_en: List[str]
    highlights_ka: List[str]


def _score_for_partner(partner: Partner) -> int:
    digits_sum = sum(int(d) for d in partner.birth_date.strftime("%Y%m%d"))
    if partner.birth_time:
        digits_sum += partner.birth_time.hour + partner.birth_time.minute
    return digits_sum


def _build_response(score: int) -> CompatibilityResponse:
    if score >= 80:
        tier_en = "Exceptional alignment"
        tier_ka = "გამორჩეული თანხვედრა"
        hints_en = [
            "Your natural rhythms already align.",
            "Keep celebrating small wins together.",
            "Make space for playful rituals.",
        ]
        hints_ka = [
            "თქვენი ბუნებრივი რიტმები უკვე თანხვედრაშია.",
            "მცირე გამარჯვებები ერთად აღნიშნეთ.",
            "თამაშისა და სითბოსთვის რიტუალები შექმენით.",
        ]
    elif score >= 60:
        tier_en = "Strong potential"
        tier_ka = "ძლიერი პოტენციალი"
        hints_en = [
            "You complement each other's strengths well.",
            "Clear communication will unlock your best.",
            "Plan shared goals with gentle structure.",
        ]
        hints_ka = [
            "ერთმანეთის ძლიერ მხარეებს კარგად ავსებთ.",
            "ღია კომუნიკაცია საუკეთესო შედეგს მოგცემთ.",
            "ერთობლივ მიზნებს მსუბუქი სტრუქტურით დაგეგმეთ.",
        ]
    elif score >= 40:
        tier_en = "Balanced mix"
        tier_ka = "დაბალანსებული ნაზავი"
        hints_en = [
            "You bring different energies to the table.",
            "Patience helps you sync faster.",
            "Pick one shared routine to anchor the week.",
        ]
        hints_ka = [
            "სხვადასხვა ენერგიებს მოაქვთ ურთიერთობაში.",
            "მოთმინება დაგეხმარებათ სწრაფად სინქრონში გახვიდეთ.",
            "კვირაში ერთი საერთო რუტინა აირჩიეთ, როგორც საყრდენი.",
        ]
    else:
        tier_en = "Needs nurturing"
        tier_ka = "დროისა და ზრუნვის საჭიროება"
        hints_en = [
            "You may value different priorities right now.",
            "Small, steady check-ins can build trust.",
            "Create a shared space for calm conversations.",
        ]
        hints_ka = [
            "ამ ეტაპზე შესაძლოა სხვადასხვა პრიორიტეტები გაქვთ.",
            "პატარა, რეგულარული დიალოგები ნდობას აამაღლებს.",
            "მშვიდი საუბრისთვის საერთო სივრცე შექმენით.",
        ]

    return CompatibilityResponse(
        score=score,
        summary_en=f"{tier_en} — score {score}/100.",
        summary_ka=f"{tier_ka} — ქულა {score}/100.",
        highlights_en=hints_en,
        highlights_ka=hints_ka,
    )


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "Couples Compatibility API"}


@app.post("/compatibility", response_model=CompatibilityResponse)
def compatibility(payload: CompatibilityRequest):
    score_a = _score_for_partner(payload.partner_a)
    score_b = _score_for_partner(payload.partner_b)
    score = (score_a * 3 + score_b * 5) % 101
    return _build_response(score)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
