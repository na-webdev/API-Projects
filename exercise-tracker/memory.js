if (from && to && limit) {
    let response = await Exercise.find({
      userId: _id,
      $expr: {
        $gt: [
          {
            $toDate: "$date",
          },
          new Date(from),
        ],
      },
      $expr: {
        $lt: [
          {
            $toDate: "$date",
          },
          new Date(to),
        ],
      },
    }).limit(limit);
    res.json({
      username,
      count: response.length,
      _id,
      log: response.map((e) => ({
        description: e.description,
        duration: e.duration,
        date: e.date,
      })),
    });
  } else if (from && to) {
    let response = await Exercise.find({
      _id,
      $expr: {
        $gt: [
          {
            $toDate: "$date",
          },
          new Date(from),
        ],
      },
      $expr: {
        $lt: [
          {
            $toDate: "$date",
          },
          new Date(to),
        ],
      },
    });
    res.json({
      username,
      count: response.length,
      _id,
      log: response.map((e) => ({
        description: e.description,
        duration: e.duration,
        date: e.date,
      })),
    });
  } else if (from) {
    let response = await Exercise.find({
      _id,
      $expr: {
        $gt: [
          {
            $toDate: "$date",
          },
          new Date(from),
        ],
      },
    });
    res.json({
      username,
      count: response.length,
      _id,
      log: response.map((e) => ({
        description: e.description,
        duration: e.duration,
        date: e.date,
      })),
    });
  } else {
    let response = await Exercise.find({ userId: _id });
    console.log(response);
    res.json({
      username,
      count: response.length,
      _id,
      log: response.map((e) => ({
        description: e.description,
        duration: e.duration,
        date: e.date,
      })),
    });
  }