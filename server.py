#!/usr/bin/env python3
"""
COMPETE HUB - Contest & Competition Auth Server (Python 3)
Supports Login, Registration with Roles (Organizer, Participant, Academy, Admin),
Email Duplication Check, Password Reset, and Static File Serving.
"""

import http.server
import socketserver
import json
import os
import re
import datetime

PORT = 8080
PUBLIC_DIR = os.path.join(os.path.dirname(__file__), 'public')

# In-memory Database Simulation with preset users for each role
registered_users = [
    {
        "id": 1,
        "email": "organizer@competehub.com",
        "password": "organizer123!",
        "name": "김주최",
        "phone": "010-1234-5678",
        "role": "organizer",
        "roleLabel": "주최자 (기업/기관)",
        "orgName": "한국인공지능협회",
        "orgType": "public",
        "bizRegNum": "123-45-67890",
        "website": "https://ai-association.kr",
        "address": "[06164] 서울 강남구 테헤란로 123 AI타워 10층",
        "createdAt": datetime.datetime.now().isoformat()
    },
    {
        "id": 2,
        "email": "participant@competehub.com",
        "password": "participant123!",
        "name": "이참가",
        "phone": "010-9876-5432",
        "role": "participant",
        "roleLabel": "참가자 (학생/개인)",
        "affiliation": "university",
        "interests": ["SW/AI", "디자인/기획", "아이디어"],
        "address": "[04524] 서울 중구 세종대로 110",
        "createdAt": datetime.datetime.now().isoformat()
    },
    {
        "id": 3,
        "email": "academy@competehub.com",
        "password": "academy123!",
        "name": "박학원",
        "phone": "010-5555-7777",
        "role": "academy",
        "roleLabel": "관련 학원 / 광고주",
        "academyName": "코드마스터 IT 아카데미",
        "academyCategory": "SW/코딩/AI",
        "bizRegNum": "987-65-43210",
        "address": "[06234] 서울 강남구 역삼로 456 코딩 빌딩 3층",
        "createdAt": datetime.datetime.now().isoformat()
    },
    {
        "id": 4,
        "email": "admin@competehub.com",
        "password": "admin123!",
        "name": "최관리",
        "phone": "010-0000-0000",
        "role": "admin",
        "roleLabel": "플랫폼 통합 관리자",
        "address": "[06164] 서울 강남구 테헤란로 123",
        "createdAt": datetime.datetime.now().isoformat()
    }
]

class CompeteHubRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def _send_json_response(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            body = json.loads(post_data.decode('utf-8')) if post_data else {}
        except Exception:
            return self._send_json_response(400, {"success": False, "message": "잘못된 JSON 요청 형식입니다."})

        # API Router
        if self.path == '/api/check-email':
            return self.handle_check_email(body)
        elif self.path == '/api/register':
            return self.handle_register(body)
        elif self.path == '/api/login':
            return self.handle_login(body)
        elif self.path == '/api/find-password':
            return self.handle_find_password(body)
        else:
            return self._send_json_response(404, {"success": False, "message": "API 엔드포인트를 찾을 수 없습니다."})

    def handle_check_email(self, body):
        email = body.get('email', '').strip()
        if not email:
            return self._send_json_response(400, {"success": False, "message": "이메일을 입력해 주세요."})
        
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            return self._send_json_response(400, {"success": False, "message": "올바른 이메일 형식이 아닙니다."})

        is_duplicate = any(u['email'].lower() == email.lower() for u in registered_users)
        if is_duplicate:
            return self._send_json_response(200, {
                "success": False, 
                "available": False, 
                "message": "이미 사용 중인 이메일입니다."
            })
        else:
            return self._send_json_response(200, {
                "success": True, 
                "available": True, 
                "message": "사용 가능한 이메일입니다."
            })

    def handle_register(self, body):
        role = body.get('role', 'participant')
        email = body.get('email', '').strip()
        password = body.get('password', '')
        name = body.get('name', '').strip()
        phone = body.get('phone', '').strip()
        zipcode = body.get('zipcode', '')
        address = body.get('address', '')
        detail_address = body.get('detailAddress', '')
        agreements = body.get('agreements', {})

        if not email or not password or not name or not phone:
            return self._send_json_response(400, {"success": False, "message": "필수 입력 항목이 누락되었습니다."})

        if len(password) < 8:
            return self._send_json_response(400, {"success": False, "message": "비밀번호는 8자 이상이어야 합니다."})

        if agreements and (not agreements.get('terms') or not agreements.get('privacy')):
            return self._send_json_response(400, {"success": False, "message": "필수 약관에 동의하셔야 합니다."})

        if any(u['email'].lower() == email.lower() for u in registered_users):
            return self._send_json_response(400, {"success": False, "message": "이미 가입된 이메일 계정입니다."})

        role_label = "일반 회원"
        if role == 'organizer':
            role_label = "주최자 (기업/기관)"
        elif role == 'participant':
            role_label = "참가자 (학생/개인)"
        elif role == 'academy':
            role_label = "관련 학원 / 광고주"

        addr_str = f"[{zipcode}] {address} {detail_address}".strip() if (zipcode and address) else (address or "주소 미입력")

        new_user = {
            "id": len(registered_users) + 1,
            "role": role,
            "roleLabel": role_label,
            "email": email,
            "password": password,
            "name": name,
            "phone": phone,
            "address": addr_str,
            "marketingAgree": bool(agreements.get('marketing')),
            "createdAt": datetime.datetime.now().isoformat(),

            "orgName": body.get('orgName', '').strip(),
            "orgType": body.get('orgType', ''),
            "bizRegNum": body.get('bizRegNum', '').strip(),
            "website": body.get('website', '').strip(),
            "affiliation": body.get('affiliation', ''),
            "interests": body.get('interests', []),
            "academyName": body.get('academyName', '').strip(),
            "academyCategory": body.get('academyCategory', '')
        }

        registered_users.append(new_user)
        print(f"[PYTHON SERVER] Registered new user: {new_user['email']}, Role: {new_user['role']}")

        user_copy = dict(new_user)
        del user_copy['password']

        return self._send_json_response(201, {
            "success": True,
            "message": f"{new_user['name']}님({role_label}), 회원가입이 성공적으로 완료되었습니다!",
            "user": user_copy
        })

    def handle_login(self, body):
        email = body.get('email', '').strip()
        password = body.get('password', '')

        if not email or not password:
            return self._send_json_response(400, {"success": False, "message": "이메일과 비밀번호를 모두 입력해 주세요."})

        user = next((u for u in registered_users if u['email'].lower() == email.lower()), None)

        if not user:
            return self._send_json_response(401, {"success": False, "message": "가입되지 않은 이메일 주소입니다."})

        if user['password'] != password:
            return self._send_json_response(401, {"success": False, "message": "비밀번호가 일치하지 않습니다."})

        print(f"[PYTHON SERVER] User logged in: {user['email']}, Role: {user['role']}")

        user_copy = dict(user)
        del user_copy['password']

        return self._send_json_response(200, {
            "success": True,
            "message": f"{user['name']}님 환영합니다!",
            "token": f"compete_hub_py_token_{int(datetime.datetime.now().timestamp())}_{user['id']}",
            "user": user_copy
        })

    def handle_find_password(self, body):
        email = body.get('email', '').strip()
        if not email:
            return self._send_json_response(400, {"success": False, "message": "이메일 주소를 입력해 주세요."})

        user = next((u for u in registered_users if u['email'].lower() == email.lower()), None)
        if not user:
            return self._send_json_response(404, {"success": False, "message": "해당 이메일로 등록된 회원 정보가 없습니다."})

        return self._send_json_response(200, {
            "success": True,
            "message": f"{email} 주소로 비밀번호 재설정 링크를 발송했습니다. 이메일을 확인해 주세요!"
        })

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), CompeteHubRequestHandler) as httpd:
        print("==================================================")
        print(f" COMPETE HUB Python Server running at http://localhost:{PORT}")
        print("==================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer shutting down.")
