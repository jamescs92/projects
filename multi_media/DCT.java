
import java.awt.*;
import java.awt.image.*;
import java.io.*;
import javax.swing.*;
import java.lang.Math;
import java.awt.event.*;
import java.util.*;




public class DCT
{
	//JFrame frame;
	JFrame frame;
	JLabel lbIm1;

	//command line paramaters
	String inputImage;
	int quantizationLevel; //int ranging from 0 to 7
	int deliveryMode; //A 1 implies baseline delivery, a 2 implies progressive delivery using spectral selection, a 3 implies progressive delivery using successive bit approximation.
	int latency;    //milliseconds of sleep

	//width and height of image
	int width = 1920;
	int height = 1080;

	//holds sets of three blocks
	blocks img_blockform[][] = new blocks[width/8][height/8];

	// hold constants for DCT
	double xcos[][] = new double[8][8];
	double ycos[][] = new double[8][8];	
	double ucos[][] = new double[8][8];	
	double vcos[][] = new double[8][8];	

	//original image
	BufferedImage img_orig;
	BufferedImage img_new;

	public static final int UP = 1;
	public static final int DOWN = 0;
	public static final double CUCV = 1/Math.sqrt(2);

	public static void main(String[] args) throws InterruptedException
	{
		DCT DCT_obj = new DCT();

		//parse command line
		DCT_obj.parse_commands(args);

		//display images
		DCT_obj.display_ims();

	}	

	//class to hold three blocks(for each color)
	private class blocks
	{
		private blocks()
		{
			red = new int[8][8];
			green = new int[8][8];
			blue = new int[8][8];

		}
		int[][] red;
		int[][] green;
		int[][] blue;
	}

	private class blocks_double
	{
		private blocks_double()
		{
			red = new double[8][8];
			green = new double[8][8];
			blue = new double[8][8];

		}
		double[][] red;
		double[][] green;
		double[][] blue;
	}

	private void display_ims() throws InterruptedException
	{
		//translate data into buffered image object
		img_orig = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		img_new = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

		//read original image 
		readImageRGB(inputImage, img_orig);

		frame = new JFrame();
		GridBagLayout gLayout = new GridBagLayout();
		frame.getContentPane().setLayout(gLayout);

		lbIm1 = new JLabel(new ImageIcon(img_new));

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

		frame.setVisible(true);

		initializeDCTconst();

		//baseline delivery
		if (deliveryMode == 1)
		{
			baseLine(img_orig, img_new, img_blockform);
		}

		//progressive delivery spectral
		else if (deliveryMode == 2)
		{
			spectral(img_orig, img_new, img_blockform);
		}

		//progressive delivery using succesive bit approximation
		else if (deliveryMode == 3)
		{
			progressive(img_orig, img_new, img_blockform);
		}


		// Use label to display the image
		

	}

	private void progressive(BufferedImage img, BufferedImage newimg, blocks[][]b_array) throws InterruptedException
	{
		//fill all b array blocks with initial values
		for(int y = 0; y < height/8 ; y++)
		{
			for(int x = 0; x<width/8; x++)
			{
				//initialize block
				b_array[x][y] = new blocks();

				//get color into each cell
				for(int j = 0; j < 8; j++)
				{
					for(int i = 0; i<8; i++)
					{
						b_array[x][y].red[i][j] = extract_color(img.getRGB(x*8 + i, y*8 + j), "red");
						b_array[x][y].green[i][j] = extract_color(img.getRGB(x*8 + i, y*8 + j), "green");
						b_array[x][y].blue[i][j] = extract_color(img.getRGB(x*8 + i, y*8 + j), "blue");

					}
				}
			}
		}

		blocks_double DCT_blockform[][] = new blocks_double[width/8][height/8];
		for(int y = 0; y < height/8 ; y++)
		{
			for(int x = 0; x<width/8; x++)
			{
				DCT_blockform[x][y] = new blocks_double();
			}
		}

		int max=0;

		for (int u = 0; u < 8; u ++)
		{
			for (int v = 0; v < 8; v++)
			{
				for(int y = 0; y < height/8 ; y++)
				{
					for(int x = 0; x<width/8; x++)
					{
						//get the DCT value for specified uv
						double DCT_val_red = getDCTval(u,v, (b_array[x][y]).red);
						double DCT_val_green = getDCTval(u,v, (b_array[x][y]).green);
						double DCT_val_blue = getDCTval(u,v, (b_array[x][y]).blue);


						//quantize
						int qDCT_val_red = quantizeVal(DCT_val_red);
						int qDCT_val_green = quantizeVal(DCT_val_green);
						int qDCT_val_blue = quantizeVal(DCT_val_blue);

						//data would be "sent" at this point.  now we are receiving

						//dequantize
						double uqDCT_val_red = deQuantizeVal(qDCT_val_red);
						double uqDCT_val_green = deQuantizeVal(qDCT_val_green);
						double uqDCT_val_blue = deQuantizeVal(qDCT_val_blue);
						

						//copy DCT vals to master block array
						DCT_blockform[x][y].red[u][v] = uqDCT_val_red;
						DCT_blockform[x][y].green[u][v] = uqDCT_val_green;
						DCT_blockform[x][y].blue[u][v] = uqDCT_val_blue;
					}
				}
			}
		}

		//time to decode start bits at 16
		
		int bitmask = 0;
		for (int bitcount = 13; bitcount >= 0; bitcount--)
		{
			//get bitmask
			bitmask+= (int) Math.pow(2, bitcount);

			//for all blocks, decode based on bitmask
			for(int y = 0; y < height/8 ; y++)
			{
				for(int x = 0; x<width/8; x++)
				{
					for(int j = 0; j < 8; j++)
					{
						for(int i = 0; i<8; i++)
						{
							int r = xyFromDCTwithBitMask(i,j, DCT_blockform[x][y].red, bitmask);
							if (r > 255)
							{
								r = 255;
							}

							if (r<0)
							{
								r = 0;
							}
							int g = xyFromDCTwithBitMask(i,j, DCT_blockform[x][y].green,bitmask);;
							if (g > 255)
							{
								g= 255;
							}

							if (g<0)
							{
								g = 0;
							}
							int b = xyFromDCTwithBitMask(i,j, DCT_blockform[x][y].blue,bitmask);
							if (b > 255)
							{
								b = 255;
							}

							if (b<0)
							{
								b = 0;
							}
							int new_color =0xff000000 | (r << 16) | (g << 8) | (b);
							newimg.setRGB(x*8 +i, y*8 + j, new_color);
						}
					}
				}
			}

			//pause and refresh display
			lbIm1.setIcon(new ImageIcon(newimg));
			Thread.sleep(latency);

		}

		



	}

	private void spectral(BufferedImage img, BufferedImage newimg, blocks[][] b_array) throws InterruptedException
	{
		//fill all b array blocks with initial values
		for(int y = 0; y < height/8 ; y++)
		{
			for(int x = 0; x<width/8; x++)
			{
				//initialize block
				b_array[x][y] = new blocks();

				//get color into each cell
				for(int j = 0; j < 8; j++)
				{
					for(int i = 0; i<8; i++)
					{
						b_array[x][y].red[i][j] = extract_color(img.getRGB(x*8 + i, y*8 + j), "red");
						b_array[x][y].green[i][j] = extract_color(img.getRGB(x*8 + i, y*8 + j), "green");
						b_array[x][y].blue[i][j] = extract_color(img.getRGB(x*8 + i, y*8 + j), "blue");

					}
				}
			}
		}

		//need a block array to remember DCT values. initialize to 0
		blocks_double DCT_blockform[][] = new blocks_double[width/8][height/8];
		for(int y = 0; y < height/8 ; y++)
		{
			for(int x = 0; x<width/8; x++)
			{
				DCT_blockform[x][y] = new blocks_double();
			}
		}

		//need a block array to hold the current image state

		//now we need to loop through u and v vals in increasing coeff order
		int u = 0;
		int v = 0;

		//1 for up 0 for down
		boolean done = false;
		int up_or_down = DOWN;
		while(!done)
		{
			for(int y = 0; y < height/8 ; y++)
			{
				for(int x = 0; x<width/8; x++)
				{
					//get the DCT value for specified uv
					double DCT_val_red = getDCTval(u,v, (b_array[x][y]).red);
					double DCT_val_green = getDCTval(u,v, (b_array[x][y]).green);
					double DCT_val_blue = getDCTval(u,v, (b_array[x][y]).blue);

					//quantize
					int qDCT_val_red = quantizeVal(DCT_val_red);
					int qDCT_val_green = quantizeVal(DCT_val_green);
					int qDCT_val_blue = quantizeVal(DCT_val_blue);

					//dequantize
					double uqDCT_val_red = deQuantizeVal(qDCT_val_red);
					double uqDCT_val_green = deQuantizeVal(qDCT_val_green);
					double uqDCT_val_blue = deQuantizeVal(qDCT_val_blue);

					//copy DCT vals to master block array
					DCT_blockform[x][y].red[u][v] = uqDCT_val_red;
					DCT_blockform[x][y].green[u][v] = uqDCT_val_green;
					DCT_blockform[x][y].blue[u][v] = uqDCT_val_blue;




					
				}
			}

			for(int y = 0; y < height/8 ; y++)
			{
				for(int x = 0; x<width/8; x++)
				{
					for(int j = 0; j < 8; j++)
					{
						for(int i = 0; i<8; i++)
						{
							int r = xyFromDCT(i,j, DCT_blockform[x][y].red);
							if (r > 255)
							{
								r = 255;
							}

							if (r<0)
							{
								r = 0;
							}
							int g = xyFromDCT(i,j, DCT_blockform[x][y].green);;
							if (g > 255)
							{
								g= 255;
							}

							if (g<0)
							{
								g = 0;
							}
							int b = xyFromDCT(i,j, DCT_blockform[x][y].blue);
							if (b > 255)
							{
								b = 255;
							}

							if (b<0)
							{
								b = 0;
							}
							int new_color =0xff000000 | (r << 16) | (g << 8) | (b);
							newimg.setRGB(x*8 +i, y*8 + j, new_color);
						}
					}
				}
			}

			lbIm1.setIcon(new ImageIcon(newimg));
			Thread.sleep(latency);

			//END CONDITIONS
			if (v == 0 && (u == 0 | u == 2 || u == 4 || u == 6))
			{
				u++;
				up_or_down = DOWN;
			}

			else if(u == 0 && (v== 1 || v == 3 || v == 5))
			{
				v++;
				up_or_down = UP;
			}

			else if(u == 7 && (v== 1 || v == 3 || v == 5))
			{
				v++;
				up_or_down = DOWN;
			}

			else if(v == 7 && (u==0 || u == 2 || u == 4 || u == 6))
			{
				u++;
				up_or_down = UP;
			}

			else if(v == 7 && u == 7)
			{
				done = true;
			}

			else
			{
				if (up_or_down == UP)
				{
					u++;
					v--;
				}
				else
				{
					v++;
					u--;
				}
			}


		}







		

	}

	private void baseLine(BufferedImage img, BufferedImage newimg, blocks[][] b_array) throws InterruptedException
	{
		for(int y = 0; y < height/8 ; y++)
		{
			for(int x = 0; x<width/8; x++)
			{
				//initialize block
				b_array[x][y] = new blocks();

				//get color into each cell
				for(int j = 0; j < 8; j++)
				{
					for(int i = 0; i<8; i++)
					{
						b_array[x][y].red[i][j] = extract_color(img.getRGB(x*8 + i, y*8 + j), "red");
						b_array[x][y].green[i][j] = extract_color(img.getRGB(x*8 + i, y*8 + j), "green");
						b_array[x][y].blue[i][j] = extract_color(img.getRGB(x*8 + i, y*8 + j), "blue");

					}
				}

				//run DCT

				double[][] DCT_vals_red = new double[8][8];
				double[][] DCT_vals_green = new double[8][8];
				double[][] DCT_vals_blue = new double[8][8];

				for (int u = 0; u < 8; u ++)
				{
					for (int v = 0; v < 8; v++)
					{
						DCT_vals_red[u][v] = getDCTval(u,v, (b_array[x][y]).red);
						DCT_vals_green[u][v] = getDCTval(u,v, (b_array[x][y]).green);
						DCT_vals_blue[u][v] = getDCTval(u,v, (b_array[x][y]).blue);
					}
				}

				//run quantization

				int[][] qDCT_vals_red = new int[8][8];
				int[][] qDCT_vals_green = new int[8][8];
				int[][] qDCT_vals_blue = new int[8][8];

				for (int u = 0; u < 8; u ++)
				{
					for (int v = 0; v < 8; v++)
					{
						qDCT_vals_red[u][v] = quantizeVal(DCT_vals_red[u][v]);
						qDCT_vals_green[u][v] = quantizeVal(DCT_vals_green[u][v]);
						qDCT_vals_blue[u][v] = quantizeVal(DCT_vals_blue[u][v]);
					}
				}

				//reverse quantization

				double[][] uqDCT_vals_red = new double[8][8];
				double[][] uqDCT_vals_green = new double[8][8];
				double[][] uqDCT_vals_blue = new double[8][8];

				for (int u = 0; u < 8; u ++)
				{
					for (int v = 0; v < 8; v++)
					{
						uqDCT_vals_red[u][v] = deQuantizeVal(qDCT_vals_red[u][v]);
						uqDCT_vals_green[u][v] = deQuantizeVal(qDCT_vals_green[u][v]);
						uqDCT_vals_blue[u][v] = deQuantizeVal(qDCT_vals_blue[u][v]);
					}
				}

				//reverse DCT
				int[][] final_vals_red = new int[8][8];
				int[][] final_vals_green = new int[8][8];
				int[][] final_vals_blue = new int[8][8];

				for (int i = 0; i < 8; i ++)
				{
					for (int j = 0;j  < 8; j++)
					{
						final_vals_red[i][j] = xyFromDCT(i,j, uqDCT_vals_red);
						final_vals_green[i][j] = xyFromDCT(i,j, uqDCT_vals_green);
						final_vals_blue[i][j] = xyFromDCT(i,j, uqDCT_vals_blue);
					}
				}


				//load colors into new image
				//get color from block
				for(int j = 0; j < 8; j++)
				{
					for(int i = 0; i<8; i++)
					{
						int r = final_vals_red[i][j];
						if (r > 255)
						{
							r = 255;
						}

						if (r<0)
						{
							r = 0;
						}
						int g = final_vals_green[i][j];
						if (g > 255)
						{
							g= 255;
						}

						if (g<0)
						{
							g = 0;
						}
						int b = final_vals_blue[i][j];
						if (b > 255)
						{
							b = 255;
						}

						if (b<0)
						{
							b = 0;
						}
						int new_color =0xff000000 | (r << 16) | (g << 8) | (b);
						newimg.setRGB(x*8 +i, y*8 + j, new_color);
					}
				}

				//pause and refresh display
				lbIm1.setIcon(new ImageIcon(newimg));
				Thread.sleep(latency);

			}
		}
	}

	private void initializeDCTconst()
	{
		for (int x = 0; x < 8; x++)
		{
			for (int u = 0; u <7; u++)
			{
				xcos[x][u] = Math.cos(((2*x+1)*u*Math.PI)/16);
			}
		}

		for (int y = 0; y < 8; y++)
		{
			for (int v = 0; v <7; v++)
			{
				ycos[y][v] = Math.cos(((2*y+1)*v*Math.PI)/16);
			}
		}
	}

	//get DCT value for given u v and rgb input value
	private double getDCTval(int u,int v, int[][] input)
	{
		//get cu and cv values
		double cu = 1;
		double cv = 1;
		if (u == 0) { cu = CUCV;}
		if (v == 0) { cv = CUCV;}

		double sum = 0;
		for(int x =0; x<8;x++)
		{
			for (int y =0; y<8; y++)
			{
				sum+= input[x][y]*xcos[x][u]*ycos[y][v];
			}
		}

		return .25*cu*cv*sum;

	}

	//quantize single DCT value
	private int quantizeVal(double input)
	{
		int result;
		result = (int) Math.round(input/Math.pow(2,quantizationLevel));
		return result;
	}

	private double deQuantizeVal(int input)
	{
		double result;
		result = (input*Math.pow(2,quantizationLevel));
		return result;
	}

	private int xyFromDCT(int x, int y, double[][] input)
	{
		

		double sum = 0;
		double cu;
		double cv;

		for(int u =0; u<8;u++)
		{
			for (int v =0; v<8; v++)
			{
					cu = 1;
					cv = 1;
					if (u == 0) { cu = 1/Math.sqrt(2);}
					if (v == 0) { cv = 1/Math.sqrt(2);}
					sum+= cu*cv*input[u][v]*xcos[x][u]*ycos[y][v];
			}
		}
		return (int) Math.round(.25*sum);
	}

	private int xyFromDCTwithBitMask(int x, int y, double[][] input, int mask)
	{
		

		double sum = 0;
		double cu;
		double cv;


		for(int u =0; u<8;u++)
		{
			for (int v =0; v<8; v++)
			{
					cu = 1;
					cv = 1;
					if (u == 0) { cu = 1/Math.sqrt(2);}
					if (v == 0) { cv = 1/Math.sqrt(2);}
					int toBitwise = (int) input[u][v];
					if (toBitwise < 0)
					{
						toBitwise*= (-1);
						toBitwise = toBitwise & mask;
						toBitwise*= (-1);
					}
					else
					{
						toBitwise = toBitwise & mask;
					}
					sum+= cu*cv*toBitwise*xcos[x][u]*ycos[y][v];
			}
		}
		return (int) Math.round(.25*sum);
	}

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

	private void parse_commands(String[] args)
	{
		inputImage = args[0];
		quantizationLevel = Integer.parseInt(args[1]);
		deliveryMode = Integer.parseInt(args[2]);
		latency = Integer.parseInt(args[3]);
	}

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
}
