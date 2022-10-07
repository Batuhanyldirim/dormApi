function addSet(setA, setB) {
  return new Set([...setA, ...setB]);
}

function getDifference(setA, setB) {
  return new Set([...setA].filter((element) => !setB.has(element)));
}

function getIntersection(setA, setB) {
  try {
    const intersection = new Set([...setA].filter((element) => setB.has(element)));

    return intersection;
  } catch (err) {
    console.log(err);
  }
}

export function choseList(genderPreference, gender, interestedSex, expectationList, expectation) {
  /* console.log("gender: " + gender);
  console.log("interestedSex: " + interestedSex); */

  var isFive = false;
  var finalResult = [];
  var resultSet;

  if (gender == 1 && interestedSex == 0) {
    resultSet = addSet(genderPreference["women"], genderPreference["non_binary"]);
  } else if (gender == 1 && interestedSex == 1) {
    resultSet = getDifference(genderPreference["men"], genderPreference["hetero"]);
  } else if (gender == 1 && interestedSex == 2) {
    resultSet = getDifference(
      addSet(genderPreference["men"], genderPreference["women"]),
      getIntersection(genderPreference["hetero"], genderPreference["men"])
    );
  } else if (gender == 0 && interestedSex == 1) {
    resultSet = addSet(genderPreference["men"], genderPreference["non_binary"]);
  } else if (gender == 0 && interestedSex == 0) {
    resultSet = getDifference(genderPreference["women"], genderPreference["hetero"]);
  } else if (gender == 0 && interestedSex == 2) {
    resultSet = getDifference(
      addSet(genderPreference["men"], genderPreference["women"]),
      getIntersection(genderPreference["hetero"], genderPreference["women"])
    );
  } else if (gender == 2 && interestedSex == 1) {
    resultSet = addSet(genderPreference["men"], genderPreference["non_binary"]);
  } else if (gender == 2 && interestedSex == 0) {
    resultSet = addSet(genderPreference["women"], genderPreference["non_binary"]);
  } else if (gender == 2 && interestedSex == 2) {
    resultSet = getDifference(
      addSet(genderPreference["women"], genderPreference["men"]),
      genderPreference["hetero"]
    );
  }

  /*   console.log("gender: ", gender);
  console.log("interestedSex: ", interestedSex);
  console.log("resultSet: ", resultSet); */

  if (expectation == 1) {
    var expectResult = addSet(
      addSet(expectationList["takilmak"], expectationList["kisaSureli"]),
      expectationList["bilmiyorum"]
    );
  } else if (expectation == 2) {
    var expectResult = addSet(
      addSet(expectationList["kisaSureli"], expectationList["takilmak"]),
      addSet(expectationList["uzunSureli"], expectationList["bilmiyorum"])
    );
  } else if (expectation == 3) {
    var expectResult = addSet(
      addSet(expectationList["uzunSureli"], expectationList["kisaSureli"]),
      expectationList["bilmiyorum"]
    );
  } else if (expectation == 4) {
    var expectResult = addSet(
      addSet(expectationList["yeniArkadas"], expectationList["etkinlikBuddy"]),
      expectationList["bilmiyorum"]
    );
  } else if (expectation == 5) {
    var expectResult = addSet(
      addSet(expectationList["etkinlikBuddy"], expectationList["yeniArkadas"]),
      expectationList["bilmiyorum"]
    );
  } else if (expectation == 6) {
    finalResult = resultSet;
    isFive = true;
  }
  /* 
  console.log("expectation: ", expectation);
  console.log("expectation: \n expectation\nexpectation\nexpectation");
  console.log("expectResult: ", expectResult); */

  if (!isFive && expectResult != undefined && resultSet != undefined) {
    console.log("expectResult: ", expectResult);
    var finalResult = getIntersection(resultSet, expectResult);
  }

  return Array.from(finalResult);
}
