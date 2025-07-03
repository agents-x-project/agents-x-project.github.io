// Demo-specific JavaScript
const demoLeftSteps = [
    {
        title: "Response:",
        content: `
            This image is an example of the <b>Ebbinghaus illusion</b> (or Titchener circles).<br>
            Although the orange circles in the middle <b>look different in size</b>—the left one appears smaller and the right one appears larger—they are actually <b>exactly the same size</b>.<br>
            The surrounding blue circles create a context that tricks your brain into perceiving the central circles as different, even though they are identical.
            <span style="color: #e74c3c; font-weight: 700; margin-left: 12px; display: inline-flex; align-items: center; gap: 5px;">✗ Incorrect</span>
        `
    }
];

const demoRightSteps = [
    {
        title: "Turn 1",
        content: `
            Let's start by planning the steps necessary to answer the question: "Which Center Circle is Larger?"<br>
            <b>Step-by-step Plan:</b> 1. Identify and isolate the two center circles in the image. 2. Measure and compare their sizes. 3. Provide the final answer.<br>
            <div class="demo-code-block">
                <div class="demo-code-content" data-typing="true"></div>
            </div>
            <img class="demo-mask-image" src="https://huggingface.co/datasets/Agents-X/Assets/resolve/main/spot.jpg" alt="Generated Mask" />
        `,
        codeContent: `# Display the image to visually locate the center circles
plt.imshow(image_clue_0)
plt.title("Original Image - Identify Center Circles")
plt.axis('on')
plt.show()`,
        hasImage: true
    },
    {
        title: "Turn 2",
        content: `
            From the displayed image, the two center circles are easily identifiable. Let's proceed to crop and display both center circles for further analysis.
            <div class="demo-code-block">
                <div class="demo-code-content" data-typing="true"></div>
            </div>
            <img class="demo-mask-image" src="https://huggingface.co/datasets/Agents-X/Assets/resolve/main/cropped_image.jpg" alt="Generated Mask" />
        `,
        codeContent: `# Crop square regions around both center circles
left_crop = img_np[173:273, 93:193, :]
right_crop = img_np[110:350, 420:660, :]

# Show the crops
fig, axs = plt.subplots(1, 2, figsize=(8, 4))
axs[0].imshow(left_crop)
axs[0].set_title('Left Center Circle')
axs[1].imshow(right_crop)
axs[1].set_title('Right Center Circle')
plt.show()`,
        hasImage: true
    },
    {
        title: "Turn 3",
        content: `
            Now let's measure the actual size of each circle by counting the orange pixels:
            <div class="demo-code-block">
                <div class="demo-code-content" data-typing="true"></div>
            </div>
            <div style="background: #f3f9ff; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <b>Output:</b><br>
                Left Center Circle Area: 3,591 pixels<br>
                Right Center Circle Area: 34,999 pixels
            </div>
        `,
        codeContent: `# Mask and count orange area for both circles
left_mask = mask_orange(left_crop)
left_area = np.sum(left_mask)

right_mask = mask_orange(right_crop)
right_area = np.sum(right_mask)

print("Left Center Circle Area (pixels):", left_area)
print("Right Center Circle Area (pixels):", right_area)`,
        hasImage: false
    },
    {
        title: "Turn 4",
        content: `
            <div style="background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%); color: #2c5f2d; padding: 20px; border-radius: 10px; margin-top: 15px;">
                From the pixel count results:<br>
                • Left Center Circle Area: 3,591 pixels<br>
                • Right Center Circle Area: 34,999 pixels<br><br>
                <b>Final Answer:</b> The right center circle is larger.
                <span style="color: #27ae60; font-weight: 700; margin-left: 12px; display: inline-flex; align-items: center; gap: 5px;">✔ Correct</span>
            </div>
        `
    }
];

let demoCurrentStep = { left: -1, right: -1 };
let demoIsPaused = false;
let demoPendingNextStep = null;

function demoTypewriterEffect(element, text, callback) {
    element.innerHTML = '';
    let i = 0;
    const speed = 20;
    
    function typeChar() {
        if (demoIsPaused) {
            demoPendingNextStep = () => demoTypewriterEffect(element, text.substring(i), callback);
            return;
        }
        
        if (i < text.length) {
            if (text.charAt(i) === '<') {
                const tagEnd = text.indexOf('>', i);
                if (tagEnd !== -1) {
                    element.innerHTML += text.substring(i, tagEnd + 1);
                    i = tagEnd + 1;
                } else {
                    element.innerHTML += text.charAt(i);
                    i++;
                }
            } else {
                element.innerHTML += text.charAt(i);
                i++;
            }
            setTimeout(typeChar, speed);
        } else {
            if (callback) callback();
        }
    }
    
    typeChar();
}

function createDemoStepCard(step, isLeft, index, onComplete) {
    const div = document.createElement('div');
    div.className = `demo-step-card ${isLeft ? 'left' : ''}`;
    
    const titleHtml = isLeft ? 
        `<div class="demo-step-title">${step.title}</div>` :
        `<div class="demo-step-title"><span class="demo-step-number">${index + 1}</span>${step.title}</div>`;
    
    div.innerHTML = titleHtml + `<div class="demo-step-content">${step.content}</div>`;
    
    const col = document.getElementById(isLeft ? 'demo-steps-col-left' : 'demo-steps-col-right');
    col.appendChild(div);
    
    setTimeout(() => {
        div.classList.add('visible');
        
        if (isLeft || (!step.codeContent && !step.hasImage)) {
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 800);
            return;
        }
        
        const codeBlock = div.querySelector('[data-typing="true"]');
        if (codeBlock && step.codeContent) {
            setTimeout(() => {
                demoTypewriterEffect(codeBlock, step.codeContent, () => {
                    const maskImg = div.querySelector('.demo-mask-image');
                    if (maskImg && step.hasImage) {
                        setTimeout(() => {
                            maskImg.classList.add('visible');
                            setTimeout(() => {
                                if (onComplete) onComplete();
                            }, 600);
                        }, 300);
                    } else {
                        if (onComplete) onComplete();
                    }
                });
            }, 500);
        } else {
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 1000);
        }
    }, 50);
}

function playDemoNextStep() {
    if (demoIsPaused) {
        demoPendingNextStep = playDemoNextStep;
        return;
    }
    
    const leftDone = demoCurrentStep.left >= demoLeftSteps.length - 1;
    const rightDone = demoCurrentStep.right >= demoRightSteps.length - 1;
    
    if (leftDone && rightDone) {
        document.getElementById('demo-pause-btn').disabled = true;
        return;
    }
    
    const leftProgress = (demoCurrentStep.left + 1) / demoLeftSteps.length;
    const rightProgress = (demoCurrentStep.right + 1) / demoRightSteps.length;
    
    if (leftProgress <= rightProgress && !leftDone) {
        demoCurrentStep.left++;
        createDemoStepCard(demoLeftSteps[demoCurrentStep.left], true, demoCurrentStep.left, playDemoNextStep);
    } else if (!rightDone) {
        demoCurrentStep.right++;
        createDemoStepCard(demoRightSteps[demoCurrentStep.right], false, demoCurrentStep.right, playDemoNextStep);
    }
}

function restartDemoAnimation() {
    demoIsPaused = false;
    demoPendingNextStep = null;
    
    const leftCol = document.getElementById('demo-steps-col-left');
    const rightCol = document.getElementById('demo-steps-col-right');
    
    leftCol.innerHTML = '<div class="demo-steps-header left"><h3 class="demo-steps-title">GPT-4.1</h3></div>';
    rightCol.innerHTML = '<div class="demo-steps-header"><h3 class="demo-steps-title">PyVision</h3></div>';
    
    demoCurrentStep = { left: -1, right: -1 };
    
    document.getElementById('demo-pause-btn').disabled = false;
    document.getElementById('demo-pause-btn').textContent = 'Pause';
    
    setTimeout(playDemoNextStep, 1000);
}

function toggleDemoPause() {
    demoIsPaused = !demoIsPaused;
    document.getElementById('demo-pause-btn').textContent = demoIsPaused ? 'Resume' : 'Pause';
    
    if (!demoIsPaused && demoPendingNextStep) {
        const pending = demoPendingNextStep;
        demoPendingNextStep = null;
        pending();
    }
}

// Original script.js content
document.addEventListener('DOMContentLoaded', function() {
    // Initialize section highlighting
    initSectionHighlight();
    // Load case data and create buttons
    loadCaseButtons();
    
    // Initialize demo
    document.getElementById('demo-restart-btn').addEventListener('click', restartDemoAnimation);
    document.getElementById('demo-pause-btn').addEventListener('click', toggleDemoPause);
    
    // Start demo animation after a delay
    setTimeout(restartDemoAnimation, 1500);
});

function initSectionHighlight() {
    const sectionLinks = document.querySelectorAll('.section-nav .section-link');
    const sections = document.querySelectorAll('h1[id], h2[id], .feature-buttons[id]');
    
    // Highlight the current section on scroll
    function highlightSection() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (sectionId && 
                scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                
                sectionLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightSection);
    highlightSection(); // Run once on initial load
    
    // Smooth scrolling for section links
    sectionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active state
                sectionLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

async function loadCaseButtons() {
    try {
        // Load the case metadata
        const casesResponse = await fetch('assets/trajectory_cases.json');
        
        if (!casesResponse.ok) {
            throw new Error(`Failed to load cases data: ${casesResponse.status}`);
        }
        
        const casesData = await casesResponse.json();
        
        // Get the category sections container
        const categorySectionsContainer = document.getElementById('category-sections');
        categorySectionsContainer.innerHTML = '';
        
        // Create sections for each category
        const categories = Object.keys(casesData);
        
        categories.forEach((categoryName, categoryIndex) => {
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            categorySection.innerHTML = `
                <h3 id="${categoryName.toLowerCase()}" class="category-title">${categoryName}</h3>
                <div class="feature-buttons category-buttons" id="buttons-${categoryName}"></div>
                <div class="reasoning-process">
                    <div id="reasoning-container-${categoryName}" class="reasoning-container">
                        <div class="reasoning-loading">
                            <div class="loading-spinner"></div>
                            <p>Select a case to view the reasoning process...</p>
                        </div>
                    </div>
                </div>
            `;
            
            categorySectionsContainer.appendChild(categorySection);
            
            // Create buttons for this category
            const buttonsContainer = document.getElementById(`buttons-${categoryName}`);
            const cases = casesData[categoryName];
            
            cases.forEach((caseInfo, caseIndex) => {
                const button = document.createElement('button');
                button.className = 'feature-button' + (caseIndex === 0 ? ' active' : '');
                button.setAttribute('data-file-dir', caseInfo.file_dir);
                button.setAttribute('data-category', categoryName);
                button.textContent = caseInfo.show_name;
                
                button.addEventListener('click', function() {
                    // Remove active class from all buttons in this category
                    buttonsContainer.querySelectorAll('.feature-button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    // Add active class to clicked button
                    this.classList.add('active');
                    // Load the trajectory case
                    loadTrajectoryCase(this.getAttribute('data-file-dir'), this.getAttribute('data-category'));
                });
                
                buttonsContainer.appendChild(button);
            });
            
            // 自动加载第一个案例
            if (cases.length > 0) {
                loadTrajectoryCase(cases[0].file_dir, categoryName);
            }
        });
        
    } catch (error) {
        console.error('Error loading case buttons:', error);
        const categorySectionsContainer = document.getElementById('category-sections');
        categorySectionsContainer.innerHTML = '<p>Error loading examples. Please try again later.</p>';
    }
}

async function loadTrajectoryCase(fileDir, category) {
    const container = document.getElementById(`reasoning-container-${category}`);
    container.innerHTML = `
        <div class="reasoning-loading">
            <div class="loading-spinner"></div>
        <p>Loading visual reasoning process...</p>
        </div>
    `;
    try {
        // Load conversation from the specified directory
        const response = await fetch(`${fileDir}/conversations.json`);
        if (!response.ok) {
            throw new Error(`Failed to load conversations: ${response.status}`);
        }
        const conversation = await response.json();
        renderConversation(conversation, container, fileDir);
    } catch (error) {
        console.error('Error loading conversation:', error);
        container.innerHTML = `
            <div class="reasoning-error">
                <div class="error-icon">⚠️</div>
                <p>Error loading the reasoning process: ${error.message}</p>
                <p>Please check the browser console for more details.</p>
            </div>
        `;
    }
}

function renderConversation(conversation, container, fileDir) {
    container.innerHTML = '';
    conversation.forEach((msg, idx) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `reasoning-message reasoning-${msg.from}`;
        let value = msg.value;

        // 1. 先提取所有代码块，临时用占位符替换（统一用[[CODEBLOCK0]]格式）
        const codeBlocks = [];
        value = value.replace(/<code>\n```python\n([\s\S]*?)\n```\n<\/code>/g, (match, code) => {
            codeBlocks.push(code);
            return `[[CODEBLOCK${codeBlocks.length - 1}]]`;
        });

        // 2. 提取图片为占位符
        const imageBlocks = [];
        value = value.replace(/<image_clue_(\d+)>.*?<\/image_clue_\d+>/gs, (match, p1) => {
            imageBlocks.push(p1);
            return `[[IMAGEBLOCK${imageBlocks.length - 1}]]`;
        });

        // 3. 渲染interpreter输出 <interpreter>...</interpreter>
        value = value.replace(/<interpreter>([\s\S]*?)<\/interpreter>/g, (match, output) => {
            if (output.includes('reasoning-image-wrap')) {
                return `<div class="tag-indicator">&lt;interpreter&gt;</div><div class="reasoning-interpreter-output">${output}</div><div class="tag-indicator">&lt;/interpreter&gt;</div>`;
            } else {
                return `<div class="tag-indicator">&lt;interpreter&gt;</div><div class="reasoning-interpreter-output">${escapeHtml(output)}</div><div class="tag-indicator">&lt;/interpreter&gt;</div>`;
            }
        });

        // 4. 渲染最终答案 <answer>...</answer>
        value = value.replace(/<answer>\n\\boxed{([\s\S]*?)}\n<\/answer>/g, (match, answer) => {
            return `<div class="tag-indicator">&lt;answer&gt;</div><div class="reasoning-answer"><div class="answer-box">Final Answer: \\boxed{${escapeHtml(answer)}}</div></div><div class="tag-indicator">&lt;/answer&gt;</div>`;
        });

        // 5. 只对普通文本做换行和markdown处理
        value = value.replace(/\n/g, '<br>');
        value = value.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        value = value.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        value = value.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        value = value.replace(/_([^_]+)_/g, '<em>$1</em>');

        // 6. 还原图片
        value = value.replace(/\[\[IMAGEBLOCK(\d+)\]\]/g, (match, idx) => {
            const img = document.createElement('img');
            img.src = `${fileDir}/images/image_${imageBlocks[idx]}.png`;
            img.className = 'reasoning-image';
            img.alt = `image_${imageBlocks[idx]}`;
            img.onerror = function() {
                this.onerror = null;
                this.src = 'https://via.placeholder.com/600x400?text=Image+Load+Failed';
            };
            const wrap = document.createElement('div');
            wrap.className = 'reasoning-image-wrap';
            wrap.appendChild(img);
            // 添加标识符并返回HTML字符串
            return `<div class="tag-indicator">&lt;image_clue_${imageBlocks[idx]}&gt;</div>${wrap.outerHTML}<div class="tag-indicator">&lt;/image_clue_${imageBlocks[idx]}&gt;</div>`;
        });

        // 7. 还原代码块
        value = value.replace(/\[\[CODEBLOCK(\d+)\]\]/g, (match, idx) => {
            return `<div class="tag-indicator">&lt;code&gt;</div><div class="reasoning-code"><pre><code class="language-python">${escapeHtml(codeBlocks[idx])}</code></pre></div><div class="tag-indicator">&lt;/code&gt;</div>`;
        });

        // 对话气泡样式
        const bubbleClass = msg.from === 'human' ? 'bubble-human' : 'bubble-gpt';
        msgDiv.innerHTML = `<div class="bubble ${bubbleClass}">${value}</div>`;
        container.appendChild(msgDiv);
    });
    // 代码高亮
    if (window.hljs) {
        container.querySelectorAll('pre code').forEach((block) => {
            window.hljs.highlightBlock(block);
        });
    }
}

// HTML转义
function escapeHtml(str) {
    return str.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
}