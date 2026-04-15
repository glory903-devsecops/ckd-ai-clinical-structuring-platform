import streamlit as st

def render_header():
    st.title("🔬 CKD Clinical Structuring Workspace")
    st.markdown("---")

def render_sidebar():
    st.sidebar.header("Configuration")
    
    disease = st.sidebar.text_input(
        "질환명 입력",
        placeholder="예: 만성 콩팥병, 당뇨병성 신증",
        help="구조화할 질환 명칭을 입력하세요."
    )
    
    preference = st.sidebar.selectbox(
        "정보 정리 기준 선택",
        options=[
            "치료 단계 중심",
            "약물 기전 중심",
            "부작용 고려 중심",
            "복용 편의성 중심"
        ]
    )
    
    st.sidebar.markdown("---")
    st.sidebar.caption("v0.1.0 PoC (Portolio Version)")
    
    return disease, preference

def render_main_tabs(result):
    tab1, tab2, tab3 = st.tabs(["📋 구조화 결과", "📚 참고 정보", "💻 프롬프트 미리보기"])
    
    with tab1:
        st.header("정보 구조화 결과")
        st.info(f"**질환명:** {result['disease']} | **정리 관점:** {result['preference']}")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader("구조화된 임상 정보")
            for section in result["sections"]:
                with st.expander(section["title"], expanded=True):
                    for item in section["items"]:
                        st.markdown(f"- {item}")
        
        with col2:
            st.subheader("질환 개요")
            st.write(result["overview"])
            
            st.subheader("관점 설명")
            st.caption(result["preference_description"])
            
            st.subheader("관련 키워드")
            st.write(", ".join(result["keywords"]))
            
    with tab2:
        st.header("참고 문헌 및 근거")
        for source in result["sources"]:
            with st.container(border=True):
                st.markdown(f"### {source['title']}")
                st.caption(f"**주제:** {source['topic']}")
                st.write(source["snippet"])
                st.button("원본 링크 확인", key=source['title'])
                
    with tab3:
        st.header("LLM Prompt Execution Logic")
        st.markdown("RAG(Retrieval-Augmented Generation)를 위해 생성된 최종 프롬프트 구조입니다.")
        st.code(result["prompt_preview"], language="markdown")
