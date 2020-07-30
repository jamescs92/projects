
import java.awt.*;
import java.awt.image.*;
import java.io.*;
import javax.swing.*;
import java.lang.Math;
import java.awt.event.*;


public class ImageDisplay {

	JFrame frame;
	JLabel lbIm1;
	int width = 1920;
	int height = 1080;

	//user inputs
	int prog_mode;
	double scale;
	int alias_mode;

	//new image width and heights
	int width_new;
	int height_new;

	int filter_size = 9;

	BufferedImage imgOne;
	BufferedImage refImage;

	/** Read Image RGB
	 *  Reads the image of given width and height at the given imgPath into the provided BufferedImage.
	 */
	private void readImageRGB(String imgPath, BufferedImage img)
	{
		try
		{
			int frameLength = width*height*3;

			File file = new File(imgPath);
			RandomAccessFile raf = new RandomAccessFile(file, "r");
			raf.seek(0);

			long len = frameLength;
			byte[] bytes = new byte[(int) len];

			raf.read(bytes);

			int ind = 0;
			for(int y = 0; y < height; y++)
			{
				for(int x = 0; x < width; x++)
				{
					byte a = 0;
					byte r = bytes[ind];
					byte g = bytes[ind+height*width];
					byte b = bytes[ind+height*width*2]; 

					int pix = 0xff000000 | ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);
					//int pix = ((a << 24) + (r << 16) + (g << 8) + b);
					img.setRGB(x,y,pix);
					ind++;
				}
			}
		}
		catch (FileNotFoundException e) 
		{
			e.printStackTrace();
		} 
		catch (IOException e) 
		{
			e.printStackTrace();
		}
	}

	//takes average around specific pixel in Buffered Image(3x3)
	private int anti_alias_filter (BufferedImage img, int x, int y)
	{
		//counts how many pixels are taken into account
		int pix_sum = 0;

		//sum of each category
		int red_sum = 0;
		int green_sum = 0;
		int blue_sum = 0;

		for(int i = x-1 ; i <= x+1 ; i++)
		{
			for(int j = y-1; j <= y+1 ; j++)
			{
				if(i >= 0 && i < width && j >= 0 && j < height)
				{
					red_sum += extract_color(img.getRGB(i,j), "red");
					green_sum += extract_color(img.getRGB(i,j), "green");
					blue_sum += extract_color(img.getRGB(i,j), "blue");
					pix_sum++;
				}
			}
		}
		//compute averages and return
		return 0xff000000 | ((red_sum/pix_sum) << 16) | ((green_sum/pix_sum) << 8) | ((blue_sum/pix_sum));
	}

	//gets individual colors from ARGB value
	private int extract_color(int result, String color)
	{
		if (color == "red")
		{
			result = (result & 0x00ff0000) >>> 16;
		}
		else if (color == "green")
		{
			result = (result & 0x0000ff00) >>> 8;
		}
		else if (color == "blue")
		{
			result = (result & 0x000000ff);
		}

		return result;
	}

	private BufferedImage resize(BufferedImage img)
	{
		BufferedImage imgTemp = new BufferedImage(width_new, height_new, BufferedImage.TYPE_INT_RGB);

		for(int y = 0; y < height_new; y++)
			{
				double div_height = ((double)height)/height_new;
				int col_num = (int) Math.floor(div_height*((double)y+.5));

				for(int x = 0; x < width_new; x++)
				{
					double div_width = ((double)width)/width_new;
					int row_num = (int) Math.floor(div_width*((double)x+.5));


					int color;
					if (alias_mode == 0)
					{
						color = img.getRGB(row_num,col_num);
					}
					else
					{
						color = anti_alias_filter(img, row_num, col_num);
					}


					//int pix = 0xff000000 | ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);
					//int pix = ((a << 24) + (r << 16) + (g << 8) + b);
					imgTemp.setRGB(x,y,color);
				}
			}

		return imgTemp;
	}

	public void showIms(String[] args){

		// Read in the specified image
		imgOne = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		readImageRGB(args[0], imgOne);
		

		//non interactive
		if (prog_mode == 1)
		{
			imgOne = resize(imgOne);
		}
		
		


		// Use label to display the image
		frame = new JFrame();
		GridBagLayout gLayout = new GridBagLayout();
		frame.getContentPane().setLayout(gLayout);

		lbIm1 = new JLabel(new ImageIcon(imgOne));

		GridBagConstraints c = new GridBagConstraints();
		c.fill = GridBagConstraints.HORIZONTAL;
		c.anchor = GridBagConstraints.CENTER;
		c.weightx = 0.5;
		c.gridx = 0;
		c.gridy = 0;

		c.fill = GridBagConstraints.HORIZONTAL;
		c.gridx = 0;
		c.gridy = 1;
		frame.getContentPane().add(lbIm1, c);
		frame.setResizable(false);
		frame.pack();

		//interactive
		if (prog_mode == 2)
		{

			//reference image to redraw from
			
			refImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
			readImageRGB(args[0], refImage);
			
			lbIm1.addMouseMotionListener(new MouseMotionAdapter()
			{
				public void mouseMoved(MouseEvent mouse)
				{
					int x = mouse.getX();
					int y= mouse.getY();
					redraw(x,y);
					lbIm1.setIcon(new ImageIcon(imgOne));
				}
			});
		}

		frame.setVisible(true);
		
	}

	private void redraw(int x, int y)
	{
		int radius = 100;
		for (int j = 0; j < height; j++)
		{
			for (int i = 0; i<width; i++)
				if(Math.sqrt(Math.pow(i-x,2) + Math.pow(j-y,2)) <= 100)
				{
					int h_cor = (int) Math.round(x+ (i-x)/((double)scale));
					int v_cor = (int) Math.round(y+ (j-y)/((double)scale));
					if (h_cor >= width || h_cor < 0 || v_cor >= height || v_cor < 0)
					{
						imgOne.setRGB(i,j, 0xffffffff);
					}
					
					else
					{
						if (alias_mode == 1)
						{
							imgOne.setRGB(i,j, anti_alias_filter (refImage, h_cor, v_cor));
						}
						else
						{
							imgOne.setRGB(i,j, refImage.getRGB(h_cor,v_cor));
						}
					}

				}

				else
				{
					int red = extract_color(refImage.getRGB(i,j), "red")/2;
					int green= extract_color(refImage.getRGB(i,j), "green")/2;
					int blue= extract_color(refImage.getRGB(i,j), "blue")/2;
					int new_color =0xff000000 | (red << 16) | (green << 8) | (blue);
					imgOne.setRGB(i,j,new_color);

				}
		}
	}

	private void parse_commands(String[] args)
	{
		prog_mode = Integer.parseInt(args[1]);
		scale = Double.parseDouble(args[2]);
		alias_mode = Integer.parseInt(args[3]);
		System.out.println("Program mode: " + prog_mode + "\nScale: " + scale + "\nAlias mode: " + 
		alias_mode);

		//calculate new width and height 
		width_new= (int) Math.floor(width*scale);
		height_new = (int) Math.floor(height*scale);
	}

	public static void main(String[] args) {
		ImageDisplay ren = new ImageDisplay();
		ren.parse_commands(args);
		ren.showIms(args);
	}

}
