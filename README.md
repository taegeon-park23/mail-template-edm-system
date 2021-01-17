# mail-template-system

EDM(Electronic Direct Mail) system

# 대용량 + 영업메일 + 메일 폼 템플릿 + 메일 폼 수정 기능

````js
const lang = "javascript with React";
const repository = "github";
const currentProgress = "10%";
# 대용량 + 영업메일 + 메일 폼 템플릿 + 메일 폼 수정 기능
```js
const lang = "javascript with React";
const repository = "github";
const currentProgress = "10%";
````

# 완료 사항
1. Mail Form Edit 기능 구현
2. Mail Form 상태 동기화
3. react-router-dom 도입
4. Email Form의 Background image가 보이지 않던 현상은 table에 image를 추가하는 것으로 대체
   4.1 background imgae가 보여지는 메일 브라우저에서는 그대로 사용 가능
5. 이메일 서비스에 관한 관련 지식은 stripo 사이트를 벤치마킹하여 적용 예정
6. Main에서 Sidebar 구현, TopBar 구현
7. mail html template 구현 방식 변경
8. 로그인 폼 구현
9. SendMail View 구현 (미리보기구현)
10. MailTemplate 버그픽스
11. 화면정의서 뷰 구현
12. 메일 폼 임시 저장, 임시 불러오기 기능 도입(우선적으로 loaclStorage를 사용, 1개의 템플릿만 저장 가능)
```js
   const complete = [SendMail, Draft, CreateTamplate, TemplateStorage, ManageGroup, ManageAddressbook, SendItems, Notification, QuestionAndAnswer];
   
   const todo = [SignIn,FindAuthInfo]
```

# 현재 이슈 사항
1. 현재 이메일을 보낼 SMTP 서버 미선정
2. 프로젝트 최종 사용자 식별 불가
3. 프로젝트에 관한 세부적인 특성 도출이 완료되지 않음.

# 진행 사항
1. 화면정의서 View 구현

# 남은 구현 사항
1. 예시 메일 폼 템플릿 1개 이상 구현
2. 테이블 설계 및 구현
3. DB 서버와의 연동
4. 메일 보내기 시범
5. 스프링서버와 연동하여 여러 콘텐츠 페이징 기능 및, CRUD 구현

