import asyncio
from playwright.async_api import async_playwright
import os

async def run_tests():
    print("Starting Playwright UI Tests for CDDP Platform...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # 1. Page Load Test
        await page.goto("http://localhost/")
        await page.wait_for_selector(".badge.secondary")
        record_text = await page.inner_text(".badge.secondary:first-child")
        print(f"[PASS] Page Loaded. Initial Records Badge: {record_text}")
        
        # 2. Checkbox Selection & Export Visibility Test
        print("Testing checkbox selection...")
        checkboxes = await page.query_selector_all("input[type='checkbox']")
        if len(checkboxes) > 0:
            await checkboxes[0].check()
            await checkboxes[1].check()
            export_btn = await page.wait_for_selector("text=선택 항목 CSV 출력")
            is_enabled = await export_btn.is_enabled()
            if is_enabled:
                print("[PASS] Checkboxes checked & Selected Export Button is enabled.")
            else:
                print("[FAIL] Selected Export Button is not enabled after checking boxes.")
        else:
            print("[FAIL] No checkboxes found.")
            
        # 3. CSV Upload Test
        print("Testing CSV Upload functionality...")
        # Prepare a dummy CSV
        csv_path = "scratch/dummy_upload_test.csv"
        with open(csv_path, "w", encoding="utf-8") as f:
            f.write('diagnosis,perspective\n"테스트용 진단 기록입니다. 신부전 의심.","진단 테스트"\n')
            
        # Trigger file upload by setting files directly on the input element
        file_input = await page.wait_for_selector("input[type='file']")
        await file_input.set_input_files(csv_path)
        
        # Wait for the item to appear in the list (wait for text to appear)
        try:
            await page.wait_for_selector("text=테스트용 진단 기록입니다.", timeout=5000)
            print("[PASS] CSV Bulk Upload successful and item rendered on dashboard.")
        except Exception as e:
            print("[FAIL] CSV Upload item not found on dashboard. Error:", e)

        await browser.close()
        print("All tests completed.")

if __name__ == "__main__":
    asyncio.run(run_tests())
