"""
OpportunityX Resume — AI & ATS Prompt Engine
Server-side prompt compilation with strict role context, ATS keyword alignment,
and uncompromising anti-hallucination guardrails.
"""

from typing import Dict, Any, List, Optional
import json

class AIPromptEngine:
    @staticmethod
    def build_prompt_messages(
        feature: str,
        content: Dict[str, Any],
        target_role: Optional[str] = None,
        target_job_description: Optional[str] = None,
        custom_prompt: Optional[str] = None
    ) -> List[Dict[str, str]]:
        """
        Compiles structured system and user messages tailored to the specific AI feature,
        grounded strictly in the candidate's verified profile data.
        """
        role = target_role or content.get("jobTitle") or content.get("targetRole") or "Software Engineering Professional"
        
        # Base system prompt with strict anti-hallucination rule
        system_base = (
            "You are OpportunityX AI, an elite ATS Resume Strategist and Executive Career Advisor.\n"
            "CRITICAL TRUTHFULNESS RULES:\n"
            "1. NEVER invent employers, job titles, years of experience, degrees, or certifications.\n"
            "2. NEVER invent numerical metrics (e.g. 'boosted revenue by 84%') if the user provided no data. "
            "If no metric exists, focus on technical complexity, scalability, and qualitative outcome.\n"
            "3. NEVER fabricate technologies or programming languages the candidate did not mention.\n"
            "4. Elevate the tone to be executive, concise, active, and strictly optimized for Applicant Tracking Systems (ATS).\n"
            "5. Respond ONLY with the requested content. Do NOT include conversational filler like 'Here is your summary:' or 'Sure!'"
        )

        norm_feature = (feature or "summary").lower().strip()

        # 1. Executive Summary Generation
        if norm_feature in ["summary", "summary_generator"]:
            skills_list = AIPromptEngine._extract_skills(content)
            experience_snippets = AIPromptEngine._extract_experience_summary(content)
            
            user_prompt = (
                f"Target Role: {role}\n"
                f"Candidate Verified Skills: {', '.join(skills_list) if skills_list else 'Technical Development'}\n"
                f"Career Background: {experience_snippets if experience_snippets else 'Full lifecycle development experience'}\n"
                f"Existing Draft/Notes: \"{content.get('existingSummary') or content.get('rawText') or custom_prompt or ''}\"\n\n"
                "TASK:\n"
                f"Craft a high-impact, 3-4 sentence Executive Professional Summary tailored specifically for a {role}.\n"
                "- Open with a strong professional title and core technical identity.\n"
                "- Highlight proven competencies using the candidate's actual skills.\n"
                "- Emphasize architecture, collaboration, and high-quality delivery.\n"
                "- Keep it punchy, truthful, ATS-optimized, and free of fluff."
            )
            return [
                {"role": "system", "content": system_base},
                {"role": "user", "content": user_prompt}
            ]

        # 2. Experience Bullet Point Rewrite / Enhancement
        elif norm_feature in ["bullet_rewrite", "experience_rewrite", "rewrite", "experience_enhance"]:
            raw_text = content.get("bullet") or content.get("rawText") or custom_prompt or str(content)
            user_prompt = (
                f"Target Role: {role}\n"
                f"Original Bullet Point:\n\"{raw_text}\"\n\n"
                "TASK:\n"
                "Rewrite this work experience bullet into 1-2 powerful, ATS-optimized bullet points.\n"
                "- Apply the Google XYZ framework: Accomplished [X] by [Y] resulting in [Z].\n"
                "- Begin with a strong action verb (e.g., Engineered, Architected, Spearheaded, Orchestrated, Streamlined).\n"
                "- Seamlessly integrate technical methods and tools mentioned in the draft.\n"
                "- If no numerical metric is present, emphasize architectural impact or operational reliability without fabricating fake numbers."
            )
            return [
                {"role": "system", "content": system_base},
                {"role": "user", "content": user_prompt}
            ]

        # 3. Technical Project Description
        elif norm_feature in ["project_describe", "project_generator"]:
            proj_name = content.get("projectName") or content.get("name") or "Technical Project"
            proj_stack = content.get("techStack") or content.get("stack") or ""
            raw_text = content.get("description") or content.get("rawText") or custom_prompt or ""
            user_prompt = (
                f"Target Role: {role}\n"
                f"Project Name: {proj_name}\n"
                f"Tech Stack: {proj_stack}\n"
                f"Draft Description: \"{raw_text}\"\n\n"
                "TASK:\n"
                "Generate a concise 2-3 sentence technical overview of this project for an engineering resume.\n"
                "- Detail the problem solved and core architectural design.\n"
                "- Highlight the key technologies and design decisions.\n"
                "- Keep it professional, concise, and ATS-friendly."
            )
            return [
                {"role": "system", "content": system_base},
                {"role": "user", "content": user_prompt}
            ]

        # 4. ATS Optimization & Keyword Analysis
        elif norm_feature in ["ats_optimize", "ats_analysis", "job_match"]:
            resume_dump = json.dumps(content, default=str)
            jd_text = target_job_description or content.get("jobDescription") or "Standard industry requirements for " + role
            user_prompt = (
                f"Target Role: {role}\n\n"
                f"Target Job Description:\n\"{jd_text[:3000]}\"\n\n"
                f"Candidate Resume Data:\n\"{resume_dump[:3000]}\"\n\n"
                "TASK:\n"
                "Analyze the resume's ATS alignment with the target job description. "
                "Provide an ATS evaluation with matched keywords, missing keywords, and 3 actionable improvements grounded in the candidate's existing background.\n"
                "Format clearly with headings: 'ATS Keyword Match', 'Recommended Keyword Integrations', and 'Optimized Bullet Suggestions'."
            )
            return [
                {"role": "system", "content": system_base},
                {"role": "user", "content": user_prompt}
            ]

        # 5. Targeted Cover Letter Builder
        elif norm_feature in ["cover_letter"]:
            company = content.get("company") or content.get("targetCompany") or "Hiring Team"
            skills_list = AIPromptEngine._extract_skills(content)
            experience_snippets = AIPromptEngine._extract_experience_summary(content)
            applicant_name = content.get("fullName") or content.get("name") or "Applicant"
            
            user_prompt = (
                f"Applicant Name: {applicant_name}\n"
                f"Target Role: {role}\n"
                f"Target Company: {company}\n"
                f"Core Skills: {', '.join(skills_list)}\n"
                f"Key Achievements/Experience: {experience_snippets}\n"
                f"Job Requirements: {target_job_description or 'Senior level qualifications for ' + role}\n\n"
                "TASK:\n"
                f"Generate a professional, compelling 3-paragraph Cover Letter addressing {company}.\n"
                "- Paragraph 1: Enthusiastic opening, target role, and core value proposition.\n"
                "- Paragraph 2: Highlight 1-2 major relevant achievements from the candidate's actual background.\n"
                "- Paragraph 3: Reiterate cultural and technical fit with a confident call to action."
            )
            return [
                {"role": "system", "content": system_base},
                {"role": "user", "content": user_prompt}
            ]

        # 6. Skills Suggestion
        elif norm_feature in ["skills_suggest"]:
            skills_list = AIPromptEngine._extract_skills(content)
            user_prompt = (
                f"Target Role: {role}\n"
                f"Current Listed Skills: {', '.join(skills_list)}\n\n"
                "TASK:\n"
                "Suggest 8-10 high-value technical and core skills relevant for this role that naturally pair with the candidate's existing stack.\n"
                "Return as a comma-separated list only."
            )
            return [
                {"role": "system", "content": system_base},
                {"role": "user", "content": user_prompt}
            ]

        # Default Generic Fallback
        else:
            raw_text = content.get("rawText") or custom_prompt or json.dumps(content, default=str)
            user_prompt = (
                f"Target Role: {role}\n"
                f"Context: {raw_text}\n\n"
                f"Request: {custom_prompt or 'Enhance this resume section for professional ATS readability.'}"
            )
            return [
                {"role": "system", "content": system_base},
                {"role": "user", "content": user_prompt}
            ]

    @staticmethod
    def _extract_skills(content: Dict[str, Any]) -> List[str]:
        skills = content.get("skills") or {}
        if isinstance(skills, list):
            return [str(s) for s in skills if s]
        if isinstance(skills, dict):
            extracted = []
            for category in ["languages", "frameworks", "tools", "databases", "cloud"]:
                val = skills.get(category)
                if isinstance(val, list):
                    extracted.extend([str(item) for item in val if item])
                elif isinstance(val, str) and val.strip():
                    extracted.append(val.strip())
            return extracted
        return []

    @staticmethod
    def _extract_experience_summary(content: Dict[str, Any]) -> str:
        exp = content.get("experience") or []
        if isinstance(exp, list) and exp:
            summaries = []
            for item in exp[:3]:
                if isinstance(item, dict):
                    role_title = item.get("role") or item.get("position") or ""
                    comp = item.get("company") or ""
                    bullets = item.get("bullets") or []
                    first_bullet = bullets[0] if isinstance(bullets, list) and bullets else ""
                    summaries.append(f"{role_title} at {comp}: {first_bullet}")
            return " | ".join(summaries)
        return ""
