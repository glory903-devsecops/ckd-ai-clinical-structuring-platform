import streamlit as st
from app.ui.layout import render_header, render_sidebar, render_main_tabs
from app.services.structuring_service import StructuringService

def main():
    st.set_page_config(
        page_title="CKD Clinical Structuring Workspace", 
        page_icon="🔬",
        layout="wide"
    )

    render_header()
    disease, preference = render_sidebar()

    if disease:
        service = StructuringService()
        result = service.run_structuring_workflow(disease, preference)
        render_main_tabs(result)
    else:
        st.info("좌측 사이드바에서 질환명을 입력하고 정리 관점을 선택해 주세요.")

if __name__ == "__main__":
    main()
