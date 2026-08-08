from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "ai-storybook-week-2-worksheet.pdf"
FONT_REGULAR = r"C:\Windows\Fonts\malgun.ttf"
FONT_BOLD = r"C:\Windows\Fonts\malgunbd.ttf"

INK = HexColor("#263740")
PLUM = HexColor("#7D4965")
GREEN = HexColor("#3B817D")
ORANGE = HexColor("#E79A3B")
PALE_GREEN = HexColor("#EAF5F1")
PALE_ORANGE = HexColor("#FFF3E1")
LINE = HexColor("#C8D8D5")
PAPER = HexColor("#FFFDF8")
MUTED = HexColor("#687981")

PAGE_W, PAGE_H = A4
MARGIN = 17 * mm
CONTENT_W = PAGE_W - MARGIN * 2


def register_fonts():
    pdfmetrics.registerFont(TTFont("Malgun", FONT_REGULAR))
    pdfmetrics.registerFont(TTFont("MalgunBold", FONT_BOLD))


def text(c, value, x, y, size=11, color=INK, bold=False):
    c.setFillColor(color)
    c.setFont("MalgunBold" if bold else "Malgun", size)
    c.drawString(x, y, value)


def header(c, title, page):
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(PLUM)
    c.rect(0, PAGE_H - 13 * mm, PAGE_W, 13 * mm, fill=1, stroke=0)
    text(c, "나도 그림동화책 작가 · 2주차", MARGIN, PAGE_H - 8.6 * mm, 8.7, white, True)
    text(c, title, MARGIN, PAGE_H - 26 * mm, 20, INK, True)
    c.setStrokeColor(ORANGE)
    c.setLineWidth(1.4)
    c.line(MARGIN, PAGE_H - 30 * mm, MARGIN + 31 * mm, PAGE_H - 30 * mm)
    text(c, "이름", PAGE_W - MARGIN - 47 * mm, PAGE_H - 25.3 * mm, 9.5, MUTED, True)
    c.setStrokeColor(LINE)
    c.setLineWidth(.8)
    c.line(PAGE_W - MARGIN - 35 * mm, PAGE_H - 25.6 * mm, PAGE_W - MARGIN, PAGE_H - 25.6 * mm)
    footer(c, page)


def footer(c, page):
    c.setStrokeColor(LINE)
    c.setLineWidth(.55)
    c.line(MARGIN, 13 * mm, PAGE_W - MARGIN, 13 * mm)
    text(c, "AI 그림동화책 2주차 워크시트", MARGIN, 8.2 * mm, 7.7, MUTED)
    text(c, f"{page} / 3", PAGE_W - MARGIN - 11 * mm, 8.2 * mm, 7.7, MUTED)


def header_overlay(c, title, page):
    c.setFillColor(PLUM)
    c.rect(0, PAGE_H - 13 * mm, PAGE_W, 13 * mm, fill=1, stroke=0)
    text(c, "나도 그림동화책 작가 · 2주차", MARGIN, PAGE_H - 8.6 * mm, 8.7, white, True)
    text(c, title, MARGIN, PAGE_H - 26 * mm, 20, INK, True)
    c.setStrokeColor(ORANGE)
    c.setLineWidth(1.4)
    c.line(MARGIN, PAGE_H - 30 * mm, MARGIN + 31 * mm, PAGE_H - 30 * mm)
    text(c, "이름", PAGE_W - MARGIN - 47 * mm, PAGE_H - 25.3 * mm, 9.5, MUTED, True)
    c.setStrokeColor(LINE)
    c.setLineWidth(.8)
    c.line(PAGE_W - MARGIN - 35 * mm, PAGE_H - 25.6 * mm, PAGE_W - MARGIN, PAGE_H - 25.6 * mm)
    footer(c, page)


def section(c, number, title, y, subtitle=None):
    c.setFillColor(GREEN)
    c.circle(MARGIN + 4.4 * mm, y + 1.5 * mm, 4.4 * mm, fill=1, stroke=0)
    text(c, str(number), MARGIN + 2.82 * mm, y - .8 * mm, 10, white, True)
    text(c, title, MARGIN + 11 * mm, y - 1.3 * mm, 14, INK, True)
    if subtitle:
        text(c, subtitle, MARGIN + 11 * mm, y - 7.5 * mm, 9.1, MUTED)
        return y - 15 * mm
    return y - 9 * mm


def field_box(c, label, x, y_top, w, h, lines=1):
    c.setFillColor(white)
    c.setStrokeColor(LINE)
    c.setLineWidth(.8)
    c.roundRect(x, y_top - h, w, h, 2.4 * mm, fill=1, stroke=1)
    text(c, label, x + 4 * mm, y_top - 7.3 * mm, 9.6, PLUM, True)
    start_y = y_top - 14 * mm
    c.setStrokeColor(HexColor("#DCE6E3"))
    c.setLineWidth(.55)
    usable_w = w - 8 * mm
    interval = (h - 18 * mm) / max(lines - 1, 1) if lines > 1 else 0
    for index in range(lines):
        line_y = start_y - interval * index
        c.line(x + 4 * mm, line_y, x + 4 * mm + usable_w, line_y)


def page_one(c):
    header(c, "주인공 만들기", 1)
    y = PAGE_H - 41 * mm
    y = section(c, 1, "나의 주인공 인터뷰", y, "주인공을 한 사람처럼 자세히 만나 보세요.")
    gap = 6 * mm
    col_w = (CONTENT_W - gap) / 2
    left = MARGIN
    right = MARGIN + col_w + gap
    h = 27 * mm
    field_box(c, "이름", left, y, col_w, h, 1)
    field_box(c, "나이", right, y, col_w, h, 1)
    y -= h + 5 * mm
    field_box(c, "좋아하는 것", left, y, col_w, h, 1)
    field_box(c, "싫어하는 것", right, y, col_w, h, 1)
    y -= h + 5 * mm
    field_box(c, "잘하는 것", left, y, col_w, h, 1)
    field_box(c, "두려워하는 것", right, y, col_w, h, 1)
    y -= h + 5 * mm
    field_box(c, "꿈", left, y, col_w, h, 1)
    field_box(c, "기타 (버릇, 말투, 특별한 점)", right, y, col_w, h, 1)
    y -= h + 14 * mm
    y = section(c, 2, "주인공의 바람", y, "모든 주인공에게는 가장 간절한 바람이 있어요.")
    field_box(c, "나의 주인공이 가장 원하는 것", MARGIN, y, CONTENT_W, 38 * mm, 3)
    text(c, "힌트  친구를 사귀고 싶다 · 가족을 만나고 싶다 · 집을 찾고 싶다 · 용기를 내고 싶다", MARGIN + 1 * mm, 22 * mm, 8.2, MUTED)
    c.showPage()


def page_two(c):
    header(c, "동화 구조", 2)
    y = PAGE_H - 41 * mm
    y = section(c, 3, "주인공의 변화", y, "이야기는 사건으로 인해 일어나는 변화의 결과이다.")
    box_h = 43 * mm
    labels = [("처음에는", PALE_GREEN), ("어떤 사건을 겪고", PALE_ORANGE), ("마지막에는", HexColor("#F3EAF0"))]
    for label, fill in labels:
        c.setFillColor(fill)
        c.setStrokeColor(LINE)
        c.setLineWidth(.7)
        c.roundRect(MARGIN, y - box_h, CONTENT_W, box_h, 2.5 * mm, fill=1, stroke=1)
        text(c, label, MARGIN + 4 * mm, y - 8 * mm, 10.5, PLUM, True)
        c.setStrokeColor(HexColor("#BFCFCD"))
        for offset in (17 * mm, 26 * mm, 35 * mm):
            c.line(MARGIN + 4 * mm, y - offset, PAGE_W - MARGIN - 4 * mm, y - offset)
        y -= box_h + 6 * mm
    y -= 4 * mm
    y = section(c, 4, "한 줄 줄거리", y, "주인공, 바람, 사건, 변화를 한 문장 안에 담아 보세요.")
    field_box(c, "나의 한 줄 줄거리", MARGIN, y, CONTENT_W, 43 * mm, 3)
    text(c, "문장 틀  [주인공]은/는 [사건]을 겪고, [변화]하게 된다.", MARGIN + 1 * mm, 22 * mm, 8.3, MUTED)
    header_overlay(c, "동화 구조", 2)
    c.showPage()


def page_three(c):
    header(c, "내 이야기 소개하기", 3)
    y = PAGE_H - 41 * mm
    y = section(c, 5, "내 주인공 소개", y, "발표 전에 핵심 내용을 정리해 보세요.")
    field_box(c, "제목", MARGIN, y, CONTENT_W, 24 * mm, 1)
    y -= 30 * mm
    field_box(c, "주인공", MARGIN, y, CONTENT_W, 24 * mm, 1)
    y -= 30 * mm
    field_box(c, "주인공이 원하는 것", MARGIN, y, CONTENT_W, 28 * mm, 1)
    y -= 34 * mm
    field_box(c, "주인공이 겪게 될 일", MARGIN, y, CONTENT_W, 37 * mm, 2)
    y -= 43 * mm
    field_box(c, "주인공의 변화", MARGIN, y, CONTENT_W, 37 * mm, 2)
    y -= 49 * mm
    y = section(c, 6, "1분 작가 발표", y, "괄호 안에 나의 이야기를 넣어 말해 보세요.")
    script_lines = [
        "제 주인공은 (                                      )입니다.",
        "이 아이는 (                                      )을/를 원합니다.",
        "이 이야기를 쓰고 싶은 이유는 (                                      )입니다.",
    ]
    c.setFillColor(HexColor("#FFF8EB"))
    c.setStrokeColor(ORANGE)
    c.roundRect(MARGIN, y - 46 * mm, CONTENT_W, 46 * mm, 2.5 * mm, fill=1, stroke=1)
    line_y = y - 11 * mm
    for item in script_lines:
        text(c, item, MARGIN + 5 * mm, line_y, 10.1, INK)
        line_y -= 11 * mm
    c.showPage()


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    register_fonts()
    c = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    c.setTitle("AI 그림동화책 2주차 워크시트")
    c.setAuthor("AI Travel Edu")
    page_one(c)
    page_two(c)
    page_three(c)
    c.save()
    print(OUTPUT)


if __name__ == "__main__":
    main()
