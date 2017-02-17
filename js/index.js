/**
 * Created by phying on 17/2/16.
 */

window.onload = function () {

    var requestAnimationFrame  = window.requestAnimationFrame       ||
                                  window.webkitRequestAnimationFrame ||
                                  window.mozRequestAnimationFrame    ||
                                  window.oRequestAnimationFrame      ||
                                  window.msRequestAnimationFrame     ||
                                  function( callback ){
                                      window.setTimeout(callback, 1000 / 60);
                                  };
    var animationTime = 1200;

    function Sort() {
        this.container = document.querySelector('#container .flex-container');
        this.childrenNum = 10;
        this.buildData();
    }
    Sort.prototype.buildData = function () {
        let container = this.container;
        let arr = [];
        while (arr.length < 10) {
            let temp = Math.floor(Math.random()*10) + 1;
            if (arr.indexOf(temp) == -1) {
                arr.push(temp);
            }
        }
        while(container.firstChild) {
            container.removeChild(container.firstChild);
        }
        arr.forEach(function (item) {
            let div = document.createElement('div');
            div.classList.add('flex-item');
            div.style.setProperty('height', item*25 + 'px');
            container.appendChild(div);
        });
    };
    Sort.prototype.compareAnimate = function (i,j) {
        let nodeI = this.getNodeByIndex(i), nodeJ = this.getNodeByIndex(j);
        return new Promise(function (resolved) {
            var startTime = new Date();
            var time = new Date();
            requestAnimationFrame(animate);
            function animate() {
                if (time - startTime < 800) {
                    nodeI.classList.add('focus');
                    nodeJ.classList.add('focus');
                    time = new Date();
                    requestAnimationFrame(animate);
                } else {
                    nodeI.classList.remove('focus');
                    nodeJ.classList.remove('focus');
                    resolved();
                }
            }
        });
    };
    Sort.prototype.swapAnimate = function (i,j) {
        let nodeI = this.getNodeByIndex(i), nodeJ = this.getNodeByIndex(j);
        let dist = nodeJ.offsetLeft - nodeI.offsetLeft;
        return new Promise(function (resolved) {
            var startTime = new Date();
            var time = new Date();
            requestAnimationFrame(animate);
            function animate() {
                if (time - startTime < animationTime) {
                    var moveDist = ((time-startTime) / animationTime) * dist;
                    nodeI.style.setProperty('left', moveDist + 'px');
                    nodeJ.style.setProperty('right',moveDist + 'px');
                    time = new Date();
                    requestAnimationFrame(animate);
                } else {
                    nodeI.style.setProperty('left','auto');
                    nodeJ.style.setProperty('right','auto');
                    resolved();
                }
            }
        });
    };

    Sort.prototype.getNodeByIndex = function (index) {
        var node = this.container.firstChild;
        while (index) {
            node = node.nextSibling;
            index --;
        }
        return node;
    };
    Sort.prototype.compare = function (i, j) {
        return getNodeHeight(this.getNodeByIndex(i)) - getNodeHeight(this.getNodeByIndex(j));
    };
    Sort.prototype.swap = function (i, j) {
        if (i === j) {
            return;
        }
        let nodeI = this.getNodeByIndex(i), nodeJ = this.getNodeByIndex(j);
        if (nodeI.nextSibling == nodeJ) {
            nodeI.parentNode.insertBefore(nodeJ, nodeI);
        } else {
            let tempNode = nodeI.nextSibling;
            nodeI.parentNode.replaceChild(nodeI, nodeJ);
            nodeI.parentNode.insertBefore(nodeJ, tempNode);
        }
    };


    function BubbleSort() {
        Sort.apply(this);
    }
    BubbleSort.prototype = new Sort();
    BubbleSort.prototype.doSort = async function () {
        document.querySelector('.sort').setAttribute('disabled',true);
        for (let i=this.childrenNum-1; i>0; i--) {
            for (let j=0; j<i; j++) {
                 await this.compareAnimate(j,j+1);
                if (this.compare(j,j+1) > 0) {
                    await  this.swapAnimate(j,j+1);
                    this.swap(j,j+1);
                }
            }
        }
        document.querySelector('.sort').removeAttribute('disabled');
    };

    function getNodeHeight(node) {
        return window.getComputedStyle(node).getPropertyValue('height').replace('px', '') - 0;
    }

    var currentSort = new BubbleSort();

    document.querySelector('.sort').addEventListener('click', function(){
        currentSort.doSort();
    });

};
