self.onmessage = function (event) {
  const todos = event.data.todos;
  const now = new Date();

  todos.forEach((todo) => {
    const endTime = new Date(`${todo.saveTime.split(" ")[0]} ${todo.endTime}`);

    // 초 단위를 무시하고 hh:mm:00 형식으로 정각 비교
    const currentTime = new Date(now);
    currentTime.setSeconds(0, 0);
    const exactEndTime = new Date(endTime);
    exactEndTime.setSeconds(0, 0);

    const timeDifference = (exactEndTime - currentTime) / 60000; // 분 단위로 계산

    if (timeDifference > 10) {
      //endTime 현재 시간에서 10분 이상 설정한 할일 추가의 경우 endTime 10분전, 정각 울림
      if (timeDifference === 10) {
        self.postMessage({ type: "warning", task: todo.todo });
      } else if (timeDifference === 0) {
        self.postMessage({ type: "completed", task: todo.todo });
      }
    } else if (timeDifference <= 10 && timeDifference >= 0) {
      // 현재 시간에서 10분 이하로 남은 경우, 정각에만 알림
      if (timeDifference === 0) {
        self.postMessage({ type: "completed", task: todo.todo });
      }
    }
  });

  // 1분마다 체크
  setTimeout(() => self.postMessage({ type: "check" }), 60000);
};
