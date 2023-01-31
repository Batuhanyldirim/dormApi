/* 
This part of code is not complete and does not working. It aims to create a user id tree
with respect to user attributes. So we can cache users in a tree and retreive them  from cache 
insted of database with log(n) complexity.
*/

import { categories } from "./lists.js";

class Node {
  constructor(categoryName, divisions) {
    this.categoryName = categoryName;
    this.catDivision = divisions;
    this.members = [];
  }
}

class LinkedList {
  constructor(categories) {
    this.head = null;

    var keyList = Object.keys(categories);
    addNew(this.head, categories, keyList);
  }

  addNew(head, categories, keyList) {
    var divisionList = [];
    if (head == null) {
      var firstKey = keyList[0];
      var secondKey = keyList[1];

      for (var i = 0; 1 < categories[firstKey].length; i++) {
        var tempNode = new Node(secondKey, Array(categories[secondKey].length).fill(null));
        divisionList.push(tempNode);
      }
      head = new Node(firstKey, divisionList);
      for (var i = 0; i < divisionList.length; i++) {
        this.addNew(head.catDivision[i], categories, keyList.slice(1));
      }
    } else {
      if (keyList.length > 1) {
        var firstKey = keyList[0];
        var secondKey = keyList[1];

        for (var i = 0; 1 < categories[firstKey].length; i++) {
          head.catDivision[i] = new Node(secondKey, Array(categories[secondKey].length).fill(null));
        }

        for (var i = 0; i < head.catDivision.length; i++) {
          this.addNew(head.catDivision[i], categories, keyList.slice(1));
        }
      } else {
        var firstKey = keyList[0];
        //var secondKey = keyList[1];

        for (var i = 0; 1 < categories[firstKey].length; i++) {
          head.catDivision[i].categoryName = firstKey;
          head.catDivision[i].catDivision = [null];
        }
      }
    }
  }

  showTree() {
    var current = this.head;
    var level = 1;
    while (current != null) {
      console.log(`This is level: `, level);
      console.log(`Name of level ${level}: `, current.categoryName);
      console.log(`Category divisions of level ${level}: `, current.categoryName);
      console.log();
      level++;
      current = current.catDivision[0];
    }
  }
}
