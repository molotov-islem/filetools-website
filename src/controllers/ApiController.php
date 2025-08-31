<?php
class ApiController {
    public function getTools() {
        header('Content-Type: application/json');
        
        $tools = [
            [
                'id' => 1,
                'name' => 'PDF to Word',
                'description' => 'Convert PDF files to editable Word documents',
                'category' => 'PDF Tools',
                'icon' => 'file-text'
            ],
            [
                'id' => 2,
                'name' => 'Image Converter',
                'description' => 'Convert between different image formats',
                'category' => 'Image Tools',
                'icon' => 'image'
            ],
            [
                'id' => 3,
                'name' => 'PDF Compressor',
                'description' => 'Reduce PDF file size without quality loss',
                'category' => 'PDF Tools',
                'icon' => 'compress'
            ]
        ];
        
        echo json_encode($tools);
    }
    
    public function convert() {
        header('Content-Type: application/json');
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            return;
        }
        
        // Simulate file conversion process
        $response = [
            'success' => true,
            'message' => 'File converted successfully',
            'downloadUrl' => '/downloads/converted_file.pdf'
        ];
        
        echo json_encode($response);
    }
}
?>
